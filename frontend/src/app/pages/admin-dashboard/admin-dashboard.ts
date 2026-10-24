import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ReservationsService } from '../my-reservations/service/my-reservations.service';

interface Habitacion {
  id: string;
  numero: number;
  tipo: string;
  capacidad: number;
  precio: string;
}

interface ReservaAdmin {
  id: string;
  id_usuario: string;
  id_habitacion: string;
  numero_habitacion: number;
  desde: string;
  hasta: string;
  huespedes: number;
  observaciones: string;
  estado: string;
  adicionales: string[];
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly reservationsService = inject(ReservationsService);

  habitaciones = signal<Habitacion[]>([]);
  reservas = signal<ReservaAdmin[]>([]);
  reservasFiltradas = signal<ReservaAdmin[]>([]);

  actualizandoReserva = signal<string | null>(null);
  errorAccion = signal('');

  busqueda = '';
  cargando = signal(true);
  error = signal('');

  hoy = new Date().toLocaleDateString('en-CA');
  fechaActual = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  ngOnInit(): void {
    forkJoin({
      habitaciones: this.http.get<Habitacion[]>(`${environment.apiUrl}/habitaciones/`),
      reservas: this.http.get<ReservaAdmin[]>(`${environment.apiUrl}/reservas/`)
    }).subscribe({
      next: ({ habitaciones, reservas }) => {
        this.habitaciones.set(habitaciones);
        this.reservas.set(reservas);
        this.reservasFiltradas.set(reservas);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los datos del hotel.');
        this.cargando.set(false);
      }
    });
  }

  get totalHabitaciones(): number {
    return this.habitaciones().length;
  }

  get habitacionesOcupadas(): number {
    return new Set(
      this.reservas()
        .filter(reserva =>
          reserva.estado.toLowerCase() !== 'cancelada' &&
          reserva.desde <= this.hoy &&
          reserva.hasta > this.hoy
        )
        .map(reserva => reserva.id_habitacion)
    ).size;
  }

  get habitacionesDisponibles(): number {
    return this.totalHabitaciones - this.habitacionesOcupadas;
  }

  get porcentajeOcupacion(): number {
    if (this.totalHabitaciones === 0) {
      return 0;
    }

    return Math.round(
      this.habitacionesOcupadas / this.totalHabitaciones * 100
    );
  }

  get reservasTotales(): number {
    return this.reservas().length;
  }

  buscarReserva(valor: string): void {
    this.busqueda = valor.trim().toLowerCase();

    const busquedaSinGuiones = this.busqueda.replace(/-/g, '');

    this.reservasFiltradas.set(
      this.reservas().filter(reserva =>
        reserva.id.toLowerCase().replace(/-/g, '').includes(busquedaSinGuiones) ||
        reserva.numero_habitacion.toString().includes(this.busqueda) ||
        reserva.estado.toLowerCase().includes(this.busqueda)
      )
    );
  }

  limpiarBusqueda(): void {
    this.busqueda = '';
    this.reservasFiltradas.set(this.reservas());
  }

  actualizarEstado(
    reserva: ReservaAdmin,
    estado: 'confirmada' | 'cancelada'
  ): void {
    const accion = estado === 'confirmada' ? 'confirmar' : 'cancelar';

    if (!confirm(`¿Querés ${accion} la reserva ${reserva.id}?`)) {
      return;
    }

    this.actualizandoReserva.set(reserva.id);
    this.errorAccion.set('');

    this.reservationsService.actualizarEstado(reserva.id, estado).subscribe({
      next: (actualizada) => {
        this.reservas.update(reservas =>
          reservas.map(actual =>
            actual.id === actualizada.id
              ? { ...actual, estado: actualizada.estado }
              : actual
          )
        );

        this.buscarReserva(this.busqueda);
        this.actualizandoReserva.set(null);
      },
      error: () => {
        this.errorAccion.set('No se pudo actualizar el estado de la reserva.');
        this.actualizandoReserva.set(null);
      }
    });
  }
}
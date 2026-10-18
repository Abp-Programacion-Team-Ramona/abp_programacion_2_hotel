import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Reservation } from './model/my-reservations.model';
import { ReservationsService } from './service/my-reservations.service';

@Component({
  selector: 'app-my-reservations',
  imports: [RouterLink, DatePipe],
  templateUrl: './my-reservations.html',
  styleUrl: './my-reservations.css',
})
export class MyReservations {

  private reservationsService = inject(ReservationsService);

  private reservations = signal<Reservation[]>([]);
  private filter = signal('');

  private route = inject(ActivatedRoute);

  cancelando = signal<string | null>(null);

  reservaDestacada = this.route.snapshot.queryParamMap.get('reserva');

  loading = signal(true);
  error = signal<string | null>(null);

  filtered = computed(() => {
    const term = this.filter().trim().toLowerCase();

    const reservas = this.reservations().filter(
      r => r.id.toLowerCase().includes(term)
    );

    if (!this.reservaDestacada) {
      return reservas;
    }

    return [...reservas].sort((a, b) => {
      if (a.id === this.reservaDestacada) return -1;
      if (b.id === this.reservaDestacada) return 1;
      return 0;
    });
  });

  constructor() {

    const storedUser = localStorage.getItem('currentUser');

    if (!storedUser) {
      this.error.set('No hay un usuario con sesión iniciada.');
      this.loading.set(false);
      return;
    }

    const currentUser = JSON.parse(storedUser);

    this.reservationsService.getAll(currentUser.id).subscribe({
      next: (data) => {
        this.reservations.set(data);
        this.loading.set(false);
      },

      error: () => {
        this.error.set(
          'No pudimos cargar las reservas. No se encuentra conexión a la base de datos.'
        );
        this.loading.set(false);
      }
    });
  }

  search(code: string): void {
    this.filter.set(code);
  }

  cancelarReserva(reserva: Reservation): void {
    if (reserva.estado.toLowerCase() === 'cancelada') {
      return;
    }

    const confirmar = confirm(
      `¿Querés cancelar la reserva ${reserva.id}?`
    );

    if (!confirmar) {
      return;
    }

    this.cancelando.set(reserva.id);
    this.error.set(null);

    this.reservationsService.actualizarEstado(
      reserva.id,
      'cancelada'
    ).subscribe({
      next: (reservaActualizada) => {
        this.reservations.update(reservas =>
          reservas.map(actual =>
            actual.id === reservaActualizada.id
              ? reservaActualizada
              : actual
          )
        );

        this.cancelando.set(null);
      },
      error: () => {
        this.error.set('No se pudo cancelar la reserva.');
        this.cancelando.set(null);
      }
    });
  }
}
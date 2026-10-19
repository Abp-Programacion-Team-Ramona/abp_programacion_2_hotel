import { Component, OnInit, signal } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReservationService } from './services/reservation.service';
import { Reservation } from './models/reservation.model';
import { Router } from '@angular/router';
import { AdicionalService } from './services/adicional.service';
import { Adicional } from './models/adicional.model';
import { Habitacion } from './models/habitacion.model';
import { HabitacionService } from './services/habitacion.service';
import { HttpClient } from '@angular/common/http';

interface FechaOcupada {
  desde: string;
  hasta: string;
}

interface DisponibilidadResponse {
  fechas_ocupadas: FechaOcupada[];
}



@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-reservartion-form',
  styleUrl: './reservartion-form.css',
  templateUrl: './reservartion-form.html',
})
export class ReservartionForm implements OnInit {

  adicionalesDisponibles: Adicional[] = [];
  habitacionesDisponibles = signal<Habitacion[]>([]);
  fechasOcupadas = signal<FechaOcupada[]>([]);
  cargandoDisponibilidad = signal(false);

  mesActual = new Date().getMonth();
  anioActual = new Date().getFullYear();

  diasSemana = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

  nombreMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril',
    'Mayo', 'Junio', 'Julio', 'Agosto',
    'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];


  constructor(
    private reservationService: ReservationService,
    private adicionalService: AdicionalService,
    private habitacionService: HabitacionService,
    private http: HttpClient,
    private router: Router) { }

  minDate = new Date().toISOString().split('T')[0];
  successMessage = signal('');
  errorMessage = signal('');

  reservationForm = new FormGroup({
    startDate: new FormControl('', Validators.required),
    endDate: new FormControl('', Validators.required),
    guests: new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.max(6)
    ]),

    dailyMenu: new FormControl(false),
    parking: new FormControl(false),
    childcare: new FormControl(false),
    historyGuide: new FormControl(false),
    transfer: new FormControl(false),
    spaServices: new FormControl(false),
    clothingCleaning: new FormControl(false),
    gymPass: new FormControl(false),
    observations: new FormControl(''),
    id_habitacion: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.habitacionService.getHabitaciones().subscribe({
      next: (habitaciones) => {
        this.habitacionesDisponibles.set(habitaciones);
      },
      error: (error) => {
        console.error('Error cargando habitaciones:', error);
        this.errorMessage.set('No se pudieron cargar las habitaciones.');
      }
    });
    this.adicionalService.getAdicionales().subscribe({
      next: (adicionales) => {
        this.adicionalesDisponibles = adicionales;
      },
      error: (error) => {
        console.error('Error cargando adicionales:', error);
        this.errorMessage.set('No se pudieron cargar los servicios adicionales.');
      }
    });
  }


  seleccionarHabitacion(habitacion: Habitacion): void {
    this.reservationForm.patchValue({
      id_habitacion: habitacion.id,
      startDate: '',
      endDate: ''
    });

    const guestsControl = this.reservationForm.controls.guests;

    guestsControl.setValidators([
      Validators.required,
      Validators.min(1),
      Validators.max(habitacion.capacidad)
    ]);

    guestsControl.updateValueAndValidity();

    this.reservationForm.controls.id_habitacion.markAsTouched();
    this.errorMessage.set('');
    this.cargarDisponibilidad(habitacion.id);
  }

  private obtenerAdicionalesSeleccionados(): string[] {

    const controles: Record<string, string> = {
      dailyMenu: 'Menú diario',
      parking: 'Cochera',
      childcare: 'Cuidado de niños',
      historyGuide: 'Paseo histórico',
      transfer: 'Traslado',
      spaServices: 'Servicios de spa',
      clothingCleaning: 'Lavandería',
      gymPass: 'Acceso al gimnasio'
    };

    return Object.entries(controles)
      .filter(([control]) =>
        this.reservationForm.get(control)?.value === true
      )
      .map(([, nombre]) =>
        this.adicionalesDisponibles.find(
          adicional => adicional.nombre === nombre
        )?.id
      )
      .filter((id): id is string => id !== undefined);
  }

  onSubmit() {

    const storedUser = localStorage.getItem('currentUser');

    if (!storedUser) {
      alert('Debés iniciar sesión para realizar una reserva.');
      return;
    }

    const currentUser = JSON.parse(storedUser);

    if (this.reservationForm.invalid) {
      this.reservationForm.markAllAsTouched();
      return;
    }

    const desde = this.reservationForm.value.startDate!;
    const hasta = this.reservationForm.value.endDate!;

    if (hasta <= desde) {
      this.errorMessage.set('La fecha de salida debe ser posterior a la fecha de entrada.');
      this.successMessage.set('');
      return;
    }

    const adicionales = this.obtenerAdicionalesSeleccionados();

    const reservation: Reservation = {
      id_usuario: currentUser.id,
      id_habitacion: this.reservationForm.value.id_habitacion!,

      desde: desde,
      hasta: hasta,
      huespedes: Number(this.reservationForm.value.guests),

      observaciones: this.reservationForm.value.observations ?? '',
      estado: 'pendiente',
      adicionales
    };

    const idHabitacion = this.reservationForm.controls.id_habitacion.value;

    const habitacion = this.habitacionesDisponibles().find(
      h => h.id === idHabitacion
    );

    const huespedes = Number(this.reservationForm.controls.guests.value);

    if (habitacion && huespedes > habitacion.capacidad) {
      this.errorMessage.set(
        `La habitación seleccionada admite un máximo de ${habitacion.capacidad} huéspedes.`
      );
      this.successMessage.set('');
      return;
    }

    this.reservationService.createReservation(reservation)
      .subscribe({
        next: response => {
          this.successMessage.set('La reserva se realizó correctamente.');
          this.errorMessage.set('');

          setTimeout(() => {
            this.router.navigate(['/my-reservations'], {
              queryParams: { reserva: response.id }
            });
          }, 1500);
        },

        error: error => {
          console.error('Error creando reserva:', error);

          if (error.status === 400) {
            const detalle = error.error;

            this.errorMessage.set(
              detalle?.id_habitacion ||
              detalle?.non_field_errors?.[0] ||
              detalle?.detail ||
              'Los datos de la reserva no son válidos.'
            );
          } else {
            this.errorMessage.set('Ocurrió un error al comunicarse con el servidor.');
          }

          this.successMessage.set('');
        }
      });
  }

  obtenerCapacidadHabitacion(): number {
    const idHabitacion = this.reservationForm.controls.id_habitacion.value;

    const habitacion = this.habitacionesDisponibles().find(
      h => h.id === idHabitacion
    );

    return habitacion?.capacidad ?? 6;
  }
  cargarDisponibilidad(idHabitacion: string): void {
    this.cargandoDisponibilidad.set(true);
    this.fechasOcupadas.set([]);

    this.http.get<DisponibilidadResponse>(
      'http://127.0.0.1:8000/api/v1/reservas/disponibilidad/',
      {
        params: { id_habitacion: idHabitacion }
      }
    ).subscribe({
      next: (respuesta) => {
        if (this.reservationForm.controls.id_habitacion.value !== idHabitacion) {
          return;
        }

        this.fechasOcupadas.set(respuesta.fechas_ocupadas);
        this.cargandoDisponibilidad.set(false);
      },
      error: (error) => {
        if (this.reservationForm.controls.id_habitacion.value !== idHabitacion) {
          return;
        }

        console.error('Error consultando disponibilidad:', error);
        this.errorMessage.set('No se pudo consultar la disponibilidad de la habitación.');
        this.cargandoDisponibilidad.set(false);
      }
    });
  }

  obtenerDiasDelMes(): (number | null)[] {
    const primerDia = new Date(this.anioActual, this.mesActual, 1);

    const cantidadDias = new Date(
      this.anioActual,
      this.mesActual + 1,
      0
    ).getDate();

    const desplazamiento = (primerDia.getDay() + 6) % 7;

    const dias: (number | null)[] = [];

    for (let i = 0; i < desplazamiento; i++) {
      dias.push(null);
    }

    for (let dia = 1; dia <= cantidadDias; dia++) {
      dias.push(dia);
    }

    return dias;
  }

  cambiarMes(direccion: number): void {
    const fecha = new Date(
      this.anioActual,
      this.mesActual + direccion,
      1
    );

    this.mesActual = fecha.getMonth();
    this.anioActual = fecha.getFullYear();
  }

  formatearFecha(anio: number, mes: number, dia: number): string {
    const mesFormateado = String(mes + 1).padStart(2, '0');
    const diaFormateado = String(dia).padStart(2, '0');

    return `${anio}-${mesFormateado}-${diaFormateado}`;
  }

  estaOcupada(dia: number): boolean {
    const fecha = this.formatearFecha(
      this.anioActual,
      this.mesActual,
      dia
    );

    return this.fechasOcupadas().some(
      reserva => fecha >= reserva.desde && fecha < reserva.hasta
    );
  }

  esFechaPasada(dia: number): boolean {
    const fecha = this.formatearFecha(
      this.anioActual,
      this.mesActual,
      dia
    );

    return fecha < this.minDate;
  }

  seleccionarFecha(dia: number): void {
    if (this.cargandoDisponibilidad()) {
      return;
    }

    const idHabitacion = this.reservationForm.controls.id_habitacion.value;

    if (!idHabitacion || this.esFechaPasada(dia)) {
      return;
    }

    const fecha = this.formatearFecha(
      this.anioActual,
      this.mesActual,
      dia
    );

    const desde = this.reservationForm.controls.startDate.value;
    const hasta = this.reservationForm.controls.endDate.value;

    if (desde === fecha && !hasta) {
      this.reservationForm.patchValue({
        startDate: '',
        endDate: ''
      });

      this.errorMessage.set('');
      return;
    }

    if (!desde || hasta) {
      if (this.estaOcupada(dia)) {
        return;
      }

      this.reservationForm.patchValue({
        startDate: fecha,
        endDate: ''
      });

      this.errorMessage.set('');
      return;
    }

    if (fecha <= desde) {
      if (!this.estaOcupada(dia)) {
        this.reservationForm.patchValue({
          startDate: fecha,
          endDate: ''
        });
      }

      return;
    }

    const haySuperposicion = this.fechasOcupadas().some(
      reserva => desde < reserva.hasta && fecha > reserva.desde
    );

    if (haySuperposicion) {
      this.errorMessage.set(
        'El período seleccionado incluye fechas ocupadas. Elegí otro rango.'
      );
      return;
    }

    this.reservationForm.patchValue({
      endDate: fecha
    });

    this.errorMessage.set('');
  }
  estaEnRango(dia: number): boolean {
    const fecha = this.formatearFecha(
      this.anioActual,
      this.mesActual,
      dia
    );

    const desde = this.reservationForm.controls.startDate.value;
    const hasta = this.reservationForm.controls.endDate.value;

    if (!desde) {
      return false;
    }

    if (!hasta) {
      return fecha === desde;
    }

    return fecha >= desde && fecha <= hasta;
  }

  estaDeshabilitada(dia: number): boolean {
    if (this.esFechaPasada(dia) || this.cargandoDisponibilidad()) {
      return true;
    }

    const fecha = this.formatearFecha(
      this.anioActual,
      this.mesActual,
      dia
    );

    const desde = this.reservationForm.controls.startDate.value;
    const hasta = this.reservationForm.controls.endDate.value;

    if (desde && !hasta && fecha > desde) {
      const haySuperposicion = this.fechasOcupadas().some(
        reserva => desde < reserva.hasta && fecha > reserva.desde
      );

      return haySuperposicion;
    }

    return this.estaOcupada(dia);
  }
  esFechaSeleccionada(dia: number): boolean {
    const fecha = this.formatearFecha(
      this.anioActual,
      this.mesActual,
      dia
    );

    return (
      fecha === this.reservationForm.controls.startDate.value ||
      fecha === this.reservationForm.controls.endDate.value
    );
  }
}


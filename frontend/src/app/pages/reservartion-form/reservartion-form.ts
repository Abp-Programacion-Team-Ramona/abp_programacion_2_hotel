import { Component, OnInit, signal } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReservationService } from './services/reservation.service';
import { Reservation } from './models/reservation.model';
import { Router } from '@angular/router';
import { AdicionalService } from './services/adicional.service';
import { Adicional } from './models/adicional.model';
import { Habitacion } from './models/habitacion.model';
import { HabitacionService } from './services/habitacion.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-reservartion-form',
  styleUrl: './reservartion-form.css',
  templateUrl: './reservartion-form.html',
})
export class ReservartionForm implements OnInit {

  adicionalesDisponibles: Adicional[] = [];
  habitacionesDisponibles = signal<Habitacion[]>([]);

  constructor(
    private reservationService: ReservationService,
    private adicionalService: AdicionalService,
    private habitacionService: HabitacionService,
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
      id_habitacion: habitacion.id
    });

    this.reservationForm.controls.id_habitacion.markAsTouched();

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
      // id_usuario: '101',
      // Para pruebas
      id_usuario: 'dfb01126-6e4e-4d28-b0e0-d2b61c4271d3',
      id_habitacion: this.reservationForm.value.id_habitacion!,

      desde: desde,
      hasta: hasta,
      huespedes: Number(this.reservationForm.value.guests),

      observaciones: this.reservationForm.value.observations ?? '',
      estado: 'pendiente',
      adicionales
    };

    this.reservationService.createReservation(reservation)
      .subscribe({
        next: response => {

          this.successMessage.set('La reserva se realizó correctamente. Redirigiendo al panel...');
          this.errorMessage.set('')

          setTimeout(() => {
            this.router.navigate(['/user-dashboard']);
          }, 1500);

          this.reservationForm.reset({
            dailyMenu: false,
            parking: false,
            childcare: false,
            historyGuide: false,
            transfer: false,
            spaServices: false,
            clothingCleaning: false,
            gymPass: false
          });
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
}


import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReservationService } from './services/reservation.service';
import { Reservation } from './models/reservation.model';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-reservartion-form',
  styleUrl: './reservartion-form.css',
  templateUrl: './reservartion-form.html',
})
export class ReservartionForm {

  constructor(private reservationService: ReservationService) { }

  minDate = new Date().toISOString().split('T')[0];
  successMessage = '';
  errorMessage = '';

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
    observations: new FormControl('')
  });

  onSubmit() {

    if (this.reservationForm.invalid) {
      this.reservationForm.markAllAsTouched();
      return;
    }

    const adicionales: string[] = [];

    if (this.reservationForm.value.dailyMenu) {
      adicionales.push('Menú diario');
    }

    if (this.reservationForm.value.parking) {
      adicionales.push('Cochera');
    }

    if (this.reservationForm.value.childcare) {
      adicionales.push('Cuidado de niños');
    }

    if (this.reservationForm.value.historyGuide) {
      adicionales.push('Paseo histórico');
    }

    if (this.reservationForm.value.transfer) {
      adicionales.push('Traslado');
    }

    if (this.reservationForm.value.spaServices) {
      adicionales.push('Servicios de spa');
    }

    if (this.reservationForm.value.clothingCleaning) {
      adicionales.push('Lavandería');
    }

    if (this.reservationForm.value.gymPass) {
      adicionales.push('Acceso al gimnasio');
    }

    const reservation: Reservation = {
      id_usuario: '1',
      id_habitacion: '101',
      desde: this.reservationForm.value.startDate!,
      hasta: this.reservationForm.value.endDate!,
      huespedes: Number(this.reservationForm.value.guests),
      observaciones: this.reservationForm.value.observations ?? '',
      estado: 'pendiente',
      adicionales: adicionales
    };

    this.reservationService.createReservation(reservation)
      .subscribe({
        next: response => {
          console.log('Reserva creada:', response);

          this.successMessage = 'La reserva se realizó correctamente.';
          this.errorMessage = '';

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

          this.errorMessage = 'No se pudo realizar la reserva.';
          this.successMessage = '';
        }
      });
  }
}
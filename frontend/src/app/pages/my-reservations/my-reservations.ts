import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
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

  loading = signal(true);
  error = signal<string | null>(null);

  filtered = computed(() => {
    const term = this.filter().trim().toLowerCase();

    return this.reservations().filter(
      (r) => r.id.toLowerCase().includes(term)
    );
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
}
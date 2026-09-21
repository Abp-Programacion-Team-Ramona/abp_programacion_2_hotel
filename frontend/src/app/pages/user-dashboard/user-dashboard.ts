import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from './model/user-dashboard.model';
import { UsersService } from './service/user-dashboard.service';

@Component({
  selector: 'app-user-dashboard',
  imports: [RouterLink],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css',
})
export class UserDashboard {

  private usersService = inject(UsersService);

  user = signal<User | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {

    const storedUser = localStorage.getItem('currentUser');

    if (!storedUser) {
      this.error.set('No hay un usuario con sesión iniciada.');
      this.loading.set(false);
      return;
    }

    const currentUser: User = JSON.parse(storedUser);

    this.usersService.getById(currentUser.id).subscribe({
      next: (data) => {
        this.user.set(data);
        this.loading.set(false);
      },

      error: () => {
        this.error.set('No pudimos cargar tus datos. Intentá nuevamente.');
        this.loading.set(false);
      },
    });
  }
}
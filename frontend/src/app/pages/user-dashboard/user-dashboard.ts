import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from './user-darshboard.model';
import { UsersService } from './user-dashboard.service';

@Component({
  selector: 'app-user-dashboard',
  imports: [RouterLink],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css',
})
export class UserDashboard {
  private usersService = inject(UsersService);

  private readonly currentUserId = '1';

  user = signal<User | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    this.usersService.getById(this.currentUserId).subscribe({
      next: (data) => {
        this.user.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No pudimos cargar tus datos. Intenta nuevamente .');
        this.loading.set(false);
      },
    });
  }
}
import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from './pages/register/services/user.service';
import { Router } from '@angular/router';
import { ADMIN_ROLE_ID } from '../constants/roles';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular');
  readonly ADMIN_ROLE_ID = ADMIN_ROLE_ID

  constructor(public userService: UserService, private router: Router) { }

  cerrarSesion(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}

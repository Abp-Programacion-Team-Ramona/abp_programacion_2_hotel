import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ADMIN_ROLE_ID } from '../../../constants/roles';
import { UserService } from '../register/services/user.service';

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  num_contacto: string;
  id_rol: string;
}

@Component({
  imports: [FormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {

  email: string = '';
  password: string = '';
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private userService: UserService
  ) { }

  iniciarSesion() {
    this.errorMessage = '';

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim());

    if (!emailValido) {
      this.errorMessage = 'Ingresá un correo electrónico válido.';
      return;
    }

    if (!this.password) {
      this.errorMessage = 'Ingresá tu contraseña.';
      return;
    }

    this.http.post<Usuario>(
      'http://127.0.0.1:8000/api/v1/login/',
      {
        email: this.email.trim(),
        password: this.password
      }
    ).subscribe({

      next: (usuario) => {
        this.userService.setCurrentUser(usuario);

        const destino = usuario.id_rol === ADMIN_ROLE_ID
          ? '/admin-dashboard'
          : '/user-dashboard';

        this.router.navigate([destino]);
      },

      error: (error) => {
        console.error('Error al iniciar sesión:', error);

        if (error.status === 400 || error.status === 401) {
          this.errorMessage = 'Correo electrónico o contraseña incorrectos.';
        } else if (error.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor.';
        } else {
          this.errorMessage = 'Ocurrió un error inesperado. Intentá nuevamente.';
        }

        this.cdr.detectChanges();
      }

    });
  }
}
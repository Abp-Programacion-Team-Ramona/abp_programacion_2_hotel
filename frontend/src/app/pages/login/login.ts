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

    this.http.post<Usuario>(
      'http://127.0.0.1:8000/api/v1/login/',
      {
        email: this.email,
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

        if (error.status === 401) {
          this.errorMessage = 'Correo electrónico o contraseña incorrectos.';
        } else {
          this.errorMessage = 'No se pudo conectar con el servidor.';
        }

        this.cdr.detectChanges();
      }

    });
  }
}
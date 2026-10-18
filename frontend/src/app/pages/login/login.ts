import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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
  cargando = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  iniciarSesion() {
    this.errorMessage = '';
    this.cargando = true;

    this.http.post<any>('http://127.0.0.1:8000/api/v1/login/', {
      email: this.email,
      password: this.password
    }).subscribe({

      next: (usuario) => {
        this.cargando = false;

        localStorage.setItem('currentUser', JSON.stringify(usuario));

        if (usuario.rol === 'Administrador' || usuario.rol === 'Empleado') {
          this.router.navigate(['/admin-dashboard']);
        } else if (usuario.rol === 'Cliente') {
          this.router.navigate(['/user-dashboard']);
        } else {
          this.errorMessage = 'Rol de usuario no reconocido.';
        }
      },

      error: (error) => {
        this.cargando = false;

        if (error.status === 401) {
          this.errorMessage = 'Correo electrónico o contraseña incorrectos.';
        } else if (error.status === 400) {
          this.errorMessage = 'Ingresá tu correo y tu contraseña.';
        } else {
          console.error('Error al conectar con el servidor:', error);
          this.errorMessage = 'No se pudo conectar con el servidor.';
        }
      }

    });

  }

}
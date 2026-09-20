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

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  iniciarSesion() {

    this.http.get<any[]>('http://localhost:3000/users').subscribe({

      next: (usuarios) => {

        const usuario = usuarios.find(
          (u) => u.email === this.email && u.password === this.password
        );

        if (usuario) {

          if (usuario.id_rol === 1 || usuario.id_rol === 2) {
            this.router.navigate(['/admin-dashboard']);
          }

          if (usuario.id_rol === 3) {
            this.router.navigate(['/user-dashboard']);
          }

        } else {

          alert('Correo o contraseña incorrectos');

        }

      },

      error: (error) => {
        console.error('Error al conectar con la base de datos:', error);
        alert('No se pudo conectar con la base de datos');
      }

    });

  }

}
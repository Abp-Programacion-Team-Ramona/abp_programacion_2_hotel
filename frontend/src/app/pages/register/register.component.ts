import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from './services/user.service';
import { User } from './models/user.model';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-register',
  styleUrl: './register.component.css',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm: FormGroup;
  successMessage = signal('');
  isLoading = signal(false);

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(event: Event): void {
    if (this.registerForm.valid) {

      this.isLoading.set(true);

      const userData: User = {
        nombre: this.registerForm.value.firstName,
        apellido: this.registerForm.value.lastName,
        num_contacto: this.registerForm.value.phone,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        id_rol: '3'
      };

      this.userService.createUser(userData).subscribe({
        next: (data) => {

          this.isLoading.set(false);

          this.successMessage.set(
            '¡Usuario creado correctamente! Redirigiendo al inicio de sesión...'
          );

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },

        error: (err) => {
          this.isLoading.set(false);
          console.error('Error registering user:', err);
        }
      });
    }
  }
}
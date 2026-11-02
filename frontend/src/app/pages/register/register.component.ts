import { Component, signal, computed } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
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

  successMessage = signal<string>('');
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);

  isSubmitDisabled = computed(() => this.isLoading());

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{7,15}$/)
      ]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.registerForm.valid) {
      this.isLoading.set(true);

      const userData: User = {
        nombre: this.registerForm.value.firstName,
        apellido: this.registerForm.value.lastName,
        num_contacto: this.registerForm.value.phone,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      };

      this.userService.createUser(userData).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.successMessage.set('¡Usuario creado correctamente!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isLoading.set(false);
          console.error('Error registering user:', err);

          if (err.status === 400) {
            const errores = err.error;

            const mensaje =
              errores?.email ||
              errores?.num_contacto ||
              errores?.password ||
              errores?.detail;

            this.errorMessage.set(
              mensaje
                ? (Array.isArray(mensaje) ? mensaje[0] : mensaje)
                : 'Revisá los datos ingresados.'
            );

          } else if (err.status === 0) {
            this.errorMessage.set('No se pudo conectar con el servidor.');
          } else {
            this.errorMessage.set('Ocurrió un error inesperado. Intentá nuevamente.');
          }
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
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

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.registerForm.valid) {
      const userData = {
        ...this.registerForm.value,
        id_rol: '3'
      };

      this.userService.createUser(userData as User).subscribe({
        next: (data) => {
          if (data) {
            this.successMessage.set('¡Usuario creado correctamente!');
            setTimeout(() => this.router.navigate(['/login']), 2500);
          }
        },
        error: (err) => console.error('Error registering user:', err)
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
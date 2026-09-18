import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';
import { User } from './models/user.model';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-register',
  styleUrl: './register.component.css',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.registerForm.valid) {
      console.log('Sending data to server...');
      
      this.authService.createUser(this.registerForm.value as User).subscribe({
        next: (data) => {
          if (data) {
            alert('Registration completed successfully. Please log in to continue.');
            this.router.navigate(['/login']);
          }
        },
        error: (err) => {
          console.error('Error registering user:', err);
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
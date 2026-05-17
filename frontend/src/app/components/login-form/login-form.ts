import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css'
})
export class LoginFormComponent {
  emailInput: string = '';
  passwordInput: string = '';
  
  // Variables para controlar las alertas exigidas por la rúbrica
  errorMessage: string | null = null;
  successMessage: string | null = null;
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLoginSubmit() {
    this.errorMessage = null;
    this.successMessage = null;
    this.loading = true;

    this.authService.login(this.emailInput, this.passwordInput).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = "¡Autenticación exitosa! Redirigiendo..."; // 
        
        // Esperamos 1.5 segundos para que el usuario vea el mensaje de éxito antes de ir al Dashboard
        setTimeout(() => {
          this.router.navigate(['/dashboard']); // 
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        //  Mensaje de error visible si las credenciales fallan
        this.errorMessage = "Credenciales incorrectas. Inténtalo de nuevo.";
      }
    });
  }
}
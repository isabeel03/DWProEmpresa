import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css'
})
export class LoginFormComponent {
  emailInput: string = '';
  dniInput: string = '';
  passwordInput: string = '';
  
  esAdmin: boolean = false; 
  errorMessage: string | null = null;
  successMessage: string | null = null;
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  cambiarModo(modoAdmin: boolean) {
    this.esAdmin = modoAdmin;
    this.errorMessage = null;
    this.successMessage = null;
    this.passwordInput = '';
    this.emailInput = '';
    this.dniInput = '';
  }

onLoginSubmit() {
    // Validación básica antes de llamar al servicio
    if (this.esAdmin && (!this.dniInput || !this.passwordInput)) {
      this.errorMessage = "Por favor, ingrese DNI y Contraseña.";
      return;
    }
    if (!this.esAdmin && (!this.emailInput || !this.passwordInput)) {
      this.errorMessage = "Por favor, ingrese Email y Contraseña.";
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    if (this.esAdmin) {
      // Llamada directa a tu AuthService, que debe hacer el POST al backend
      this.authService.loginAdmin(this.dniInput, this.passwordInput).subscribe({
        next: (res) => {
          this.loading = false;
          // ASUMIMOS QUE EL BACKEND DEVUELVE EL PERFIL SI ES EXITOSO
          if (res && res.perfil) {
            this.router.navigate(['/core-bancario']);
          } else {
            this.errorMessage = "Error: Perfil de usuario no encontrado.";
          }
        },
        error: (err) => {
          this.loading = false;
          // Aquí capturamos el error real del backend (Ej: 401 Unauthorized)
          this.errorMessage = err.error?.detail || 'Acceso denegado. Verifique sus credenciales.';
        }
      });
    } else {
      this.authService.login(this.emailInput, this.passwordInput).subscribe({
        next: (res) => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = 'Credenciales de Homebanking incorrectas.';
        }
      });
    }
  }
}
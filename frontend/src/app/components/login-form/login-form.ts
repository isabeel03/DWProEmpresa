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
      next: (res: any) => {
        this.loading = false;
        
        // Guardamos el token JWT general que usará el interceptor o guardián de rutas
        if (res.access_token) {
          localStorage.setItem('token', res.access_token);
        }

        // ===================================================================
        // 🛡️ REGLA DE ROL (CRITERIO 3: RBAC EN FRONTEND)
        // El backend responde con "tipo_usuario": "empleado" o "cliente"
        // ===================================================================
        if (res.tipo_usuario === 'empleado') {
          this.successMessage = `¡Ingreso exitoso al Core Bancario! Bienvenido/a ${res.perfil.nombre}...`;
          
          // Guardamos la sesión interna del personal
          localStorage.setItem('empleado_session', JSON.stringify(res));
          
          // Redirigimos a la bandeja de control de riesgos en 1.5 segundos
          setTimeout(() => {
            this.router.navigate(['/core-bancario']);
          }, 1500);

        } else {
          // Si no es empleado, por defecto es un Cliente de la Banca por Internet
          this.successMessage = "¡Autenticación exitosa! Redirigiendo a tu Banca por Internet...";
          
          // Guardamos la sesión del cliente (Saldos, cuenta, nombres)
          localStorage.setItem('user_session', JSON.stringify(res));
          
          // Redirigimos al Dashboard financiero clásico del cliente
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        }
      },
      error: (err) => {
        this.loading = false;
        console.error("Error en login:", err);
        
        // Si el backend envía un detalle específico de error, lo pintamos; de lo contrario, mostramos un genérico
        if (err.error && err.error.detail) {
          this.errorMessage = err.error.detail;
        } else {
          this.errorMessage = "Credenciales incorrectas o usuario no registrado en el sistema comercial.";
        }
      }
    });
  }
}
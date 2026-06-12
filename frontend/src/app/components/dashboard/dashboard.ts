import { Component, OnInit,inject,PLATFORM_ID} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  userEmail: string | null = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Al cargar la pantalla, recuperamos el correo guardado en el login
    this.userEmail = this.authService.getUserEmail();
  }

  onLogout() {
    // Limpiamos los tokens y lo regresamos de forma segura al Home
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
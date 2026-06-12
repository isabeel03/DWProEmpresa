import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- ¡Soluciona el error de *ngIf, ngClass y los pipes!
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, HttpClientModule], // <-- Aquí inyectamos el CommonModule al componente estático
  templateUrl: './dashboard-admin.html',
  styleUrls: []
})
export class DashboardAdminComponent implements OnInit { // <-- Cambiado de DashboardAdmin a DashboardAdminComponent
  solicitudes: any[] = [];
  empleadoNombre: string = '';
  empleadoRol: string = '';
  empleadoId: string = '';
  
  private apiUrl = 'http://localhost:8000'; // Url de tu servidor FastAPI

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // Sincronizar y validar la sesión del administrador
    const sessionData = localStorage.getItem('empleado_session');
    if (!sessionData) {
      this.router.navigate(['/login']);
      return;
    }

    const session = JSON.parse(sessionData);
    this.empleadoNombre = session.perfil.nombre;
    this.empleadoRol = session.perfil.rol;
    this.empleadoId = session.perfil.id;

    this.cargarSolicitudes();
  }

  cargarSolicitudes() {
    this.http.get<any[]>(`${this.apiUrl}/admin/solicitudes`).subscribe({
      next: (data) => {
        this.solicitudes = data;
      },
      error: (err) => {
        console.error('Error al cargar la bandeja del Core:', err);
        alert('No se pudo sincronizar la información del Core Bancario');
      }
    });
  }

  evaluar(solicitudId: number, accion: string) {
    const confirmacion = confirm(`¿Está seguro de cambiar el estado de la solicitud #${solicitudId} a: ${accion}?`);
    if (!confirmacion) return;

    const payload = {
      solicitud_id: solicitudId,
      accion: accion,
      empleado_id: this.empleadoId
    };

    this.http.post(`${this.apiUrl}/admin/evaluar-solicitud`, payload).subscribe({
      next: (res: any) => {
        alert(res.message);
        this.cargarSolicitudes(); // Recarga la tabla de inmediato tras el desembolso
      },
      error: (err) => {
        console.error('Error en la evaluación:', err);
        alert('Ocurrió un error al procesar el desembolso en la cuenta destino');
      }
    });
  }

  contarPorSemaforo(color: string): number {
    if (!this.solicitudes) return 0;
    return this.solicitudes.filter(s => s.semaforo_riesgo === color).length;
  }

  cerrarSesion() {
    localStorage.removeItem('empleado_session');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
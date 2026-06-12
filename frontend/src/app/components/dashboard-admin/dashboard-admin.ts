import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, HttpClientModule], 
  templateUrl: './dashboard-admin.html',
  styleUrls: []
})
export class DashboardAdminComponent implements OnInit { 
  solicitudes: any[] = [];
  bandejaMora: any[] = []; // 👈 NUEVO: Almacena los créditos con problemas de pago
  vistaActual: string = 'solicitudes'; // 👈 NUEVO: Permite cambiar entre la bandeja de solicitudes y la de mora
  
  empleadoNombre: string = '';
  empleadoRol: string = '';
  empleadoId: string = '';
  
  private apiUrl = 'http://localhost:8000'; // Url de tu servidor FastAPI

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // Sincronizar y validar la sesión del administrador (Tu lógica original intacta)
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
    this.cargarBandejaMora(); // 👈 NUEVO: Carga también la mora por si el rol es Administrador
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

  // 👈 NUEVO: Carga los créditos retrasados desde FastAPI para cumplir el paso 4 del profesor
  cargarBandejaMora() {
    this.http.get<any[]>(`${`${this.apiUrl}`}/admin/bandeja-mora`).subscribe({
      next: (data) => {
        this.bandejaMora = data;
      },
      error: (err) => console.error('Error al cargar cartera vencida:', err)
    });
  }

  // Tu función original de evaluar, perfectamente integrada
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
        this.cargarBandejaMora();
      },
      error: (err) => {
        console.error('Error en la evaluación:', err);
        alert('Ocurrió un error al procesar la decisión en el Core');
      }
    });
  }

  // 👈 NUEVO: Método para que el Asesor (11111111) eleve el caso a los jefes (Guion Paso 1)
  escalarAComite(solicitudId: number) {
    this.http.post(`${this.apiUrl}/admin/enviar-comite`, { solicitud_id: solicitudId }).subscribe({
      next: (res: any) => {
        alert(res.message);
        this.cargarSolicitudes();
      },
      error: (err) => alert('Error al escalar la solicitud.')
    });
  }

  // 👈 NUEVO: Método para que el Administrador (11111112) ejecute "Derivar Judicial" o "Castigar" (Guion Paso 4 y 5)
  procesarAccionCobranza(creditoId: number, accionCobranza: string) {
    const payload = {
      credito_id: creditoId,
      accion: accionCobranza
    };

    this.http.post(`${this.apiUrl}/admin/gestionar-mora`, payload).subscribe({
      next: (res: any) => {
        alert(`🚨 Sistema de Recuperaciones: ${res.message}`);
        this.cargarBandejaMora(); // Refresca la lista de morosos
      },
      error: (err) => {
        // Muestra el mensaje de error de las reglas de negocio de Python (Ej: "Requiere mínimo 121 días")
        alert(`❌ Operación denegada: ${err.error.detail}`);
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
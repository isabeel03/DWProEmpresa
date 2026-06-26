import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ⚡ Necesario para la observación del modal [(ngModel)]

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule], // ⚡ Se integró FormsModule aquí
  templateUrl: './dashboard-admin.html',
  styleUrls: ['./dashboard-admin.css']
})
export class DashboardAdminComponent implements OnInit { 
  solicitudes: any[] = [];
  bandejaMora: any[] = []; 
  vistaActual: string = 'solicitudes'; 
  
  empleadoNombre: string = '';
  empleadoRol: string = '';
  empleadoId: string = '';
  
  // Métricas calculadas dinámicamente para el diseño ejecutivo
  montoPromedioSolicitado: number = 0;
  totalMontoSolicitado: number = 0;
  
  // Control de estado del Modal Pop-up
  modalEvaluacion: boolean = false;
  solicitudSeleccionada: any = null;
  observacionEvaluador: string = '';

  private apiUrl = 'http://localhost:8000/api'; 

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
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
    this.cargarBandejaMora(); 
  }

  calcularMetricas(): void {
    if (!this.solicitudes || this.solicitudes.length === 0) {
      this.totalMontoSolicitado = 0;
      this.montoPromedioSolicitado = 0;
      return;
    }
    this.totalMontoSolicitado = this.solicitudes.reduce((acc, curr) => acc + (curr.monto_solicitado || 0), 0);
    this.montoPromedioSolicitado = this.totalMontoSolicitado / this.solicitudes.length;
  }

  cargarSolicitudes(): void {
    this.http.get<any[]>('http://localhost:8000/api/admin/solicitudes').subscribe({
      next: (data) => {
        this.solicitudes = data.map(sol => ({
          ...sol,
          cliente_id: sol.cliente_id || sol.cliente_codigo_desarrollo || 'cli000001',
          estado: sol.estado ? sol.estado : 'Pendiente',
          monto_solicitado: sol.monto_solicitado || sol.monto || 0
        }));
        this.calcularMetricas(); // Recalcula los KPIs superiores
      },
      error: (err) => console.error('Error al cargar solicitudes:', err)
    });
  }

  abrirEvaluacion(solicitud: any): void {
    this.solicitudSeleccionada = { ...solicitud };
    this.observacionEvaluador = ''; // Limpiamos el cuadro de texto
    this.modalEvaluacion = true;
  }

  cerrarModalEvaluacion(): void {
    this.modalEvaluacion = false;
    this.solicitudSeleccionada = null;
  }

  procesarDecision(nuevoEstado: 'Aprobado' | 'Rechazado'): void {
    if (!this.solicitudSeleccionada) return;

    const payload = {
      id: this.solicitudSeleccionada.id,
      estado: nuevoEstado,
      observacion: this.observacionEvaluador || 'Evaluación procesada desde el Core.'
    };

    this.http.post('http://localhost:8000/api/admin/solicitudes/evaluar', payload).subscribe({
      next: (res: any) => {
        alert(`Solicitud #${payload.id} cambiada a estado: ${nuevoEstado} con éxito.`);
        this.cerrarModalEvaluacion();
        this.cargarSolicitudes(); // Recarga la tabla de inmediato
      },
      error: (err) => {
        console.error('Error al actualizar el estado:', err);
        alert('Hubo un problema al guardar la decisión en Supabase.');
      }
    });
  }

  cargarBandejaMora() {
    this.http.get<any[]>(`${this.apiUrl}/admin/bandeja-mora`).subscribe({
      next: (data) => {
        this.bandejaMora = data;
      },
      error: (err) => console.error('Error al cargar cartera vencida:', err)
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
        this.cargarSolicitudes(); 
        this.cargarBandejaMora();
      },
      error: (err) => {
        console.error('Error en la evaluación:', err);
        alert('Ocurrió un error al procesar la decisión en el Core');
      }
    });
  }

  escalarAComite(solicitudId: number) {
    this.http.post(`${this.apiUrl}/admin/enviar-comite`, { solicitud_id: solicitudId }).subscribe({
      next: (res: any) => {
        alert(res.message);
        this.cargarSolicitudes();
      },
      error: (err) => alert('Error al escalar la solicitud.')
    });
  }

  procesarAccionCobranza(creditoId: number, accionCobranza: string) {
    const payload = {
      credito_id: creditoId,
      accion: accionCobranza
    };

    this.http.post(`${this.apiUrl}/admin/gestionar-mora`, payload).subscribe({
      next: (res: any) => {
        alert(`🚨 Sistema de Recuperaciones: ${res.message}`);
        this.cargarBandejaMora(); 
      },
      error: (err) => {
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
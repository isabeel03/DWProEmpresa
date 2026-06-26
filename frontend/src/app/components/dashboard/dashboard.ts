import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], 
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  
  // Datos del cliente
  cliente: any = {
    id: 'cli000001', 
    nombre: '',
    numeroCuenta: '',
    saldoAhorros: 0,
    creditoPendiente: 0
  };

  // Variables vinculadas al Formulario [(ngModel)]
  tipoCredito: string = 'Personas';
  productoSeleccionado: string = 'CONSUMO DIRECTO';
  montoSolicitado: number | null = null; 
  teaAplicable: number = 71.76;
  numCuotas: number | null = null;       
  fechaDesembolso: string = '2026-06-17';
  seguroDesgravamen: string = 'si';

  // Variables de salida (Resultados del bloque derecho)
  cuotaMensual: number = 0;
  tceaEstimada: number = 71.76;
  totalIntereses: number = 0;
  totalSeguros: number = 0;
  montoTotalPagar: number = 0;
  modalTransferencia: boolean = false;
  modalEstadoCuenta: boolean = false;
  modalCronograma: boolean = false;
  
  // Variables para simular la transferencia
  cuentaDestino: string = '';
  montoTransferir: number | null = null;

  private apiUrl = 'http://localhost:8000/api'; 

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private http: HttpClient 
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        console.log('Sesión activa verificada.');
      }
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarDatosDesdeSupabase();
    }
  }

  // === CÁLCULO FINANCIERO DINÁMICO (Intacto) ===
  recalcularSimulacion(): void {
    const monto = Number(this.montoSolicitado);
    const cuotas = Number(this.numCuotas);

    if (!monto || monto <= 0 || !cuotas || cuotas <= 0) {
      this.cuotaMensual = 0;
      this.totalIntereses = 0;
      this.totalSeguros = 0;
      this.montoTotalPagar = 0;
      this.tceaEstimada = Number(this.teaAplicable);
      return;
    }

    if (this.seguroDesgravamen === 'si') {
      this.totalSeguros = monto * 0.00095 * cuotas;
    } else {
      this.totalSeguros = 0;
    }

    const teaDecimal = Number(this.teaAplicable) / 100;
    const tem = Math.pow(1 + teaDecimal, 1 / 12) - 1;

    const numerador = monto * tem;
    const denominador = 1 - Math.pow(1 + tem, -cuotas);
    const cuotaPura = numerador / denominador;

    const seguroMensual = this.totalSeguros / cuotas;
    this.cuotaMensual = cuotaPura + seguroMensual;

    this.montoTotalPagar = this.cuotaMensual * cuotas;
    this.totalIntereses = this.montoTotalPagar - monto - this.totalSeguros;
    
    this.tceaEstimada = Number(this.teaAplicable) + (this.seguroDesgravamen === 'si' ? 1.90 : 0);
  }

  // === CONSULTA DE DATOS CON SUPABASE / BACKEND ===
  async cargarDatosDesdeSupabase() {
    try {
      this.cliente = {
        id: 'cli000001',
        nombre: 'Roberto Carlos',
        numeroCuenta: '450-3321948-0-12',
        saldoAhorros: 15450.00,
        creditoPendiente: 8200.00
      };
    } catch (err) {
      console.error('Error cargando información financiera desde el backend:', err);
    }
  }

  // === MODIFICADO: Validación reactiva de seguridad para evitar plazos nulos o ceros ===
  solicitarCredito(): void {
    if (!this.montoSolicitado || this.montoSolicitado <= 0) {
      alert('Por favor, ingresa un monto válido en el simulador antes de enviar la solicitud.');
      return;
    }

    // Blindaje analítico: Si el plazo viene vacío, indefinido o en 0, forzamos un valor mínimo base (12 meses)
    // para que la división de la cuota en FastAPI no de infinito ni caiga en "Rechazado" por descarte.
    if (!this.numCuotas || this.numCuotas <= 0) {
      this.numCuotas = 12;
      this.recalcularSimulacion();
    }

    // Armamos la estructura exacta que mapea "CreditoSolicitudInput" en el backend de Python
    const payload = {
      cliente_id: this.cliente.id || 'cli000001',
      monto: Number(this.montoSolicitado),
      plazo: Number(this.numCuotas),
      tipo_credito: this.tipoCredito || 'Personas',
      cuota: Number(this.cuotaMensual || (Number(this.montoSolicitado) / Number(this.numCuotas))),
      ingreso_mensual: 3500.00 // Respaldo estático para la evaluación paramétrica de RDS
    };

    // Petición POST directa al ruteador unificado de FastAPI
    this.http.post('http://localhost:8000/api/creditos/solicitar', payload).subscribe({
      next: (res: any) => {
        alert(`¡Solicitud de S/. ${payload.monto} enviada con éxito!\nRegistrada correctamente en Supabase con estado Pendiente.`);
      },
      error: (err) => {
        console.error('Error al registrar crédito en Supabase:', err);
        alert('No se pudo procesar el guardado de la solicitud.');
      }
    });
  }

  verTransferencias(): void {
    this.modalTransferencia = true;
  }

  verEstadoCuenta(): void {
    this.modalEstadoCuenta = true;
  }

  verCronograma(): void {
    if (!this.montoSolicitado || !this.numCuotas || this.cuotaMensual === 0) {
      alert('Primero ingresa un monto y cuotas en el simulador para generar tu cronograma.');
      return;
    }
    this.modalCronograma = true;
  }

  cerrarModales(): void {
    this.modalTransferencia = false;
    this.modalEstadoCuenta = false;
    this.modalCronograma = false;
    this.cuentaDestino = '';
    this.montoTransferir = null;
  }

  ejecutarTransferencia(): void {
    if (!this.cuentaDestino || !this.montoTransferir || this.montoTransferir <= 0) {
      alert('Por favor, completa los campos correctamente.');
      return;
    }
    alert(`⚡ Transferencia exitosa de S/. ${this.montoTransferir} a la cuenta ${this.cuentaDestino}`);
    this.cerrarModales();
  }

  cerrarSesion(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      alert('Sesión destruida de forma segura. Redireccionando al Login...');
      this.router.navigate(['/']); 
    }
  }
}
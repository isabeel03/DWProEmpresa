import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // 👈 IMPORTANTE: Resuelve el error del pipe 'number'
import { FormsModule } from '@angular/forms';     // 👈 IMPORTANTE: Resuelve el error de [(ngModel)]
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-solicitar-credito',
  standalone: true, // Tu componente trabaja en modo Standalone
  imports: [CommonModule, FormsModule, HttpClientModule], // 👈 Añadidos aquí para que el HTML los reconozca
  templateUrl: './solicitar-credito.html',
  styleUrls: []
})
export class SolicitarCreditoComponent {
  // Datos iniciales mapeando con la sesión y el backend
  credito = {
    cliente_id: 'cli000007', // Código del cliente de prueba requerido por el docente
    monto: 0,
    plazo: 0,
    tipo_credito: 'capital',
    cuota: 0,
    ingreso_mensual: 0
  };

  constructor(private http: HttpClient) {}

  // Simulación rápida de cuota antes de enviar al backend
  calcularCuotaEstimada() {
    if (this.credito.monto > 0 && this.credito.plazo > 0) {
      const tasaInteresMensualSimulada = 0.025; // Tasa base del 2.5% de desarrollo
      this.credito.cuota = (this.credito.monto * tasaInteresMensualSimulada) / (1 - Math.pow(1 + tasaInteresMensualSimulada, -this.credito.plazo));
    } else {
      this.credito.cuota = 0;
    }
  }

  enviarSolicitud() {
    const urlBackend = 'http://localhost:8000/creditos/solicitar';
    
    this.http.post(urlBackend, this.credito).subscribe({
      next: (response: any) => {
        alert('✅ ¡Solicitud enviada con éxito! Pasará a evaluación en el Core Bancario de inmediato.');
        console.log(response);
      },
      error: (err) => {
        alert('❌ Error al procesar el envío hacia el Sistema Central.');
        console.error(err);
      }
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-solicitar-credito',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './solicitar-credito.html',
  styleUrls: ['./solicitar-credito.css']
})
export class SolicitarCreditoComponent implements OnInit {
  
  // Objeto con la estructura exacta que pide tu Pydantic (CreditoSolicitudInput) en Python
  solicitud = {
    cliente_id: 'cli000007', // Por defecto con tu data semilla para pruebas directas
    monto: 0,
    plazo: 0,
    tipo_credito: 'Consumo',
    cuota: 0,
    ingreso_mensual: 0
  };

  private apiUrl = 'http://localhost:8000/api'; // Url base unificada con /api

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // Si el cliente ya inició sesión en la Banca por Internet, auto-completamos su ID/DNI
    const sessionData = localStorage.getItem('usuario_session');
    if (sessionData) {
      const session = JSON.parse(sessionData);
      this.solicitud.cliente_id = session.perfil.id || session.perfil.dni;
    }
  }

  // Simulación rápida de cuota usando una tasa de interés base para que el formulario no envíe cuota en cero
  calcularCuotaDefecto() {
    if (this.solicitud.monto > 0 && this.solicitud.plazo > 0) {
      const tasaMensual = 0.015; // 1.5% estimado
      const monto = this.solicitud.monto;
      const plazo = this.solicitud.plazo;
      
      // Fórmula clásica simple de cuota
      const cuotaCalculada = (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazo));
      this.solicitud.cuota = parseFloat(cuotaCalculada.toFixed(2));
    } else {
      this.solicitud.cuota = 0;
    }
  }

  enviarSolicitud() {
    // FORZAMOS LA CONVERSIÓN A NÚMEROS AQUÍ PARA EVITAR EL BAD REQUEST
    const payload = {
      cliente_id: this.solicitud.cliente_id,
      monto: Number(this.solicitud.monto),
      plazo: Number(this.solicitud.plazo),
      tipo_credito: this.solicitud.tipo_credito,
      cuota: Number(this.solicitud.cuota),
      ingreso_mensual: Number(this.solicitud.ingreso_mensual)
    };

    // Validaciones básicas con los datos ya convertidos
    if (payload.monto <= 0 || payload.plazo <= 0 || payload.ingreso_mensual <= 0) {
      alert('Por favor, ingrese valores válidos mayores a cero.');
      return;
    }

    console.log('Enviando payload limpio al Core:', payload);

    // Enviamos "payload" en lugar de "this.solicitud"
    this.http.post(`${this.apiUrl}/creditos/solicitar`, payload).subscribe({
      next: (res: any) => {
        alert('🎉 ¡Solicitud procesada con éxito en el Core Central Bancario!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error detallado del servidor:', err);
        if (err.error && err.error.detail) {
          alert(`Error del Core: ${JSON.stringify(err.error.detail)}`);
        } else {
          alert('Ocurrió un problema técnico al registrar la solicitud en Supabase.');
        }
      }
    });
  }

  cancelar() {
    this.router.navigate(['/dashboard']);
  }
}
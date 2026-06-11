import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // <-- ¡Importante!

@Component({
  selector: 'app-canales',
  standalone: true,
  imports: [RouterModule], // <-- ¡Añadido aquí!
  template: `
    <div class="page-container">
      <h1 class="page-title">Nuestros Canales de Atención</h1>
      <p class="page-subtitle">Estamos siempre cerca de ti para que realices tus operaciones sin perder tiempo.</p>
      
      <div class="grid-3">
        <div class="info-card" style="border-top-color: var(--proempresa-orange)">
          <h2>📍 Red de Agencias</h2>
          <p>Visítanos en nuestras oficinas a nivel nacional para recibir asesoría personalizada de un funcionario de créditos.</p>
        </div>
        <div class="info-card">
          <h2>🏪 Agentes ProEmpresa</h2>
          <p>Realiza retiros, depósitos y pago de cuotas en las bodegas y comercios afiliados más cercanos a tu negocio.</p>
        </div>
        <div class="info-card" style="border-top-color: var(--proempresa-orange)">
          <h2>💻 Banca Digital</h2>
          <p>Consulta tus saldos, estados de cuenta y cronogramas de pago las 24 horas del día sin salir de tu local.</p>
        </div>
      </div>
    </div>
  `
})
export class CanalesComponent {}
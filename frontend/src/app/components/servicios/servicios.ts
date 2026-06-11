import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // <-- ¡Importante!

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [RouterModule], // <-- ¡Añadido aquí!
  template: `
    <div class="page-container">
      <h1 class="page-title">Servicios Financieros Complementarios</h1>
      <p class="page-subtitle">Facilitamos tus transacciones diarias de manera rápida, transparente y segura.</p>
      
      <div class="grid-3">
        <div class="info-card">
          <h2>🏢 Pago de Servicios</h2>
          <p>Cancela tus recibos de luz, agua y teléfono directamente en nuestras ventanillas o red de agentes autorizados.</p>
        </div>
        <div class="info-card" style="border-top-color: var(--proempresa-orange)">
          <h2>💸 Giros Nacionales</h2>
          <p>Envía dinero a tus familiares o proveedores a nivel nacional al instante con bajas comisiones de transferencia.</p>
        </div>
        <div class="info-card">
          <h2>🛡️ Seguros Microfinanzas</h2>
          <p>Protege tu negocio, mercadería y herramientas frente a imprevistos mediante microseguros a tu medida.</p>
        </div>
      </div>
    </div>
  `
})
export class ServiciosComponent {}
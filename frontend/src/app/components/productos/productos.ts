import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // <-- ¡Importante!

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [RouterModule], // <-- ¡Añadido aquí!
  template: `
    <div class="page-container">
      <h1 class="page-title">Nuestros Productos Financieros</h1>
      <p class="page-subtitle">Soluciones de crédito y ahorro con el respaldo que tu microempresa merece.</p>
      
      <div class="grid-3">
        <div class="info-card" style="border-top-color: var(--proempresa-orange)">
          <h2>📈 Capital de Trabajo</h2>
          <p>Financiamiento ágil para compra de mercadería, materias primas o insumos para tus campañas comerciales.</p>
        </div>
        <div class="info-card">
          <h2>🏗️ Activo Fijo</h2>
          <p>Te prestamos el dinero necesario para adquirir maquinarias, equipos de trabajo o ampliar tu local comercial.</p>
        </div>
        <div class="info-card" style="border-top-color: var(--proempresa-orange)">
          <h2>💰 Depósito a Plazo Fijo</h2>
          <p>Rentabiliza tus ganancias dejando crecer tus ahorros con una tasa de interés preferencial garantizada (TREA hasta 7.5%).</p>
        </div>
      </div>
    </div>
  `
})
export class ProductosComponent {}
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // <-- ¡Importante!

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [RouterModule], // <-- ¡Añadido aquí!
  template: `
    <div class="page-container">
      <h1 class="page-title">Centro de Ayuda y Contacto</h1>
      <p class="page-subtitle">¿Tienes alguna duda sobre tu crédito o cuenta de ahorros? Nuestro equipo técnico te ayuda.</p>
      
      <div class="grid-3">
        <div class="info-card">
          <h2>📞 Central Telefónica</h2>
          <p>Llámanos de lunes a sábado de 9:00 AM a 6:00 PM a nuestra línea directa de atención: (01) 614-2424.</p>
        </div>
        <div class="info-card" style="border-top-color: var(--proempresa-orange)">
          <h2>📧 Soporte Digital</h2>
          <p>Escríbenos tus consultas o solicitudes formales al correo electrónico: <strong>atencionalcliente&#64;proempresa.com.pe</strong></p>
        </div>
        <div class="info-card">
          <h2>⚖️ Libro de Reclamaciones</h2>
          <p>Ponemos a tu disposición nuestra plataforma virtual de reclamos de acuerdo a las directrices de la SBS e Indecopi.</p>
        </div>
      </div>
    </div>
  `
})
export class ContactoComponent {}
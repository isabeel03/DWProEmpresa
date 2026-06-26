import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacto.html',   // <-- Cambiado de './ayuda-contacto.html' a './contacto.html'
  styleUrl: './contacto.css'       // <-- Cambiado de './ayuda-contacto.css' a './contacto.css'
})
export class ContactoComponent {     // <-- Cambiado de 'AyudaContactoComponent' a 'ContactoComponent'
  seccionAbierta: string | null = null;

  toggleSeccion(seccion: string) {
    if (this.seccionAbierta === seccion) {
      this.seccionAbierta = null;
    } else {
      this.seccionAbierta = seccion;
    }
  }

  enviarSimulado() {
    alert('¡Acción simulada con éxito! El sistema procesó la solicitud de forma segura.');
    this.seccionAbierta = null;
  }
}
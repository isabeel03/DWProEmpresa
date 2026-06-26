import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css'
})
export class ServiciosComponent implements OnInit {
  // Manejo de secciones
  servicioActivo: 'cambio' | 'recaudacion' | 'remesas' | 'seguros' = 'cambio';

  // Lógica del Tipo de Cambio
  tasaCompra: number = 3.72;
  tasaVenta: number = 3.76;
  montoOrigen: number = 100;
  tipoOperacion: 'comprar' | 'vender' = 'comprar';
  montoDestino: number = 0;
  simboloDestino: string = '$';

  ngOnInit() {
    this.calcularCambio();
  }

  setServicio(servicio: 'cambio' | 'recaudacion' | 'remesas' | 'seguros') {
    this.servicioActivo = servicio;
  }

  calcularCambio() {
    if (!this.montoOrigen || this.montoOrigen <= 0) {
      this.montoDestino = 0;
      return;
    }

    if (this.tipoOperacion === 'comprar') {
      // De Soles a Dólares
      this.montoDestino = this.montoOrigen / this.tasaVenta;
      this.simboloDestino = '$';
    } else {
      // De Dólares a Soles
      this.montoDestino = this.montoOrigen * this.tasaCompra;
      this.simboloDestino = 'S/';
    }
  }
}
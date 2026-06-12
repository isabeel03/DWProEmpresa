import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-simulador',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './simulador.html' // <-- ¡Ahora apunta al archivo HTML independiente!
})
export class SimuladorComponent {
  monto: number = 5000;
  selectedCuotas: number = 12;
  tipoCredito: string = 'capital';
  tasaInteres: number = 0.28; 

  cuotaEstimada: number = 0;
  totalIntereses: number = 0;
  simulacionCalculada: boolean = false;

  plazosDisponibles: number[] = [6, 12, 18, 24, 36];

  constructor() {
    this.calcularCuota(); 
  }

  actualizarTasa() {
    this.tasaInteres = this.tipoCredito === 'capital' ? 0.28 : 0.24;
    this.calcularCuota();
  }

  calcularCuota() {
    if (this.monto < 1000 || this.monto > 50000) {
      alert("Por favor ingrese un monto válido entre S/. 1,000 y S/. 50,000");
      return;
    }
    const interstateMensual = Math.pow(1 + this.tasaInteres, 1 / 12) - 1;
    this.cuotaEstimada = (this.monto * interstateMensual) / (1 - Math.pow(1 + interstateMensual, -this.selectedCuotas));
    this.totalIntereses = (this.cuotaEstimada * this.selectedCuotas) - this.monto;
    this.simulacionCalculada = true;
  }
}
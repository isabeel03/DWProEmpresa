import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-simulador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './simulador.html',
  styleUrls: ['./simulador.css']
})
export class SimuladorComponent implements OnInit {
  
  // Variables del Formulario
  tipo_credito: string = 'Personas';
  producto: string = 'consumo_directo';
  moneda: string = 'Soles';
  monto: number = 7000;
  plazo: number = 5;
  fecha_desembolso: string = '2026-06-17';
  
  // 💡 TUS 4 VALORES ESPECÍFICOS DE TEA
  tasasDisponibles: number[] = [15.50, 28.00, 45.00, 71.76];
  tea: number = 71.76; // Tasa inicial por defecto

  // Variables de Seguros
  tiene_desgravamen: string = 'si';
  tipo_desgravamen: string = 'básico';
  tiene_optativo: string = 'no';

  // Resultados
  cuotaEstimada: number = 0;
  tceaCalculada: number = 73.66;
  totalIntereses: number = 0;
  totalSeguros: number = 0;
  totalAPagar: number = 0;

  ngOnInit() {
    this.calcularCuota();
  }

  actualizarProducto() {
    if (this.tipo_credito === 'Negocios') {
      this.producto = 'capital_trabajo';
    } else {
      this.producto = 'consumo_directo';
    }
    this.calcularCuota();
  }

  calcularCuota() {
    if (!this.monto || !this.plazo || this.plazo <= 0) {
      this.cuotaEstimada = 0;
      this.totalIntereses = 0;
      this.totalSeguros = 0;
      this.totalAPagar = 0;
      return;
    }

    // Usar dinámicamente la TEA seleccionada por el usuario
    this.tceaCalculada = this.tea + 1.90; // Cálculo referencial de TCEA
    const tasaMensual = Math.pow(1 + (this.tea / 100), 1 / 12) - 1;
    const factor = (tasaMensual * Math.pow(1 + tasaMensual, this.plazo)) / 
                   (Math.pow(1 + tasaMensual, this.plazo) - 1);
    
    let cuotaBase = this.monto * factor;

    let costoDesgravamenMensual = 0;
    if (this.tiene_desgravamen === 'si') {
      costoDesgravamenMensual = this.monto * 0.00095;
    }

    let costoOptativoMensual = (this.tiene_optativo === 'si') ? 15.00 : 0;

    this.cuotaEstimada = cuotaBase + costoDesgravamenMensual + costoOptativoMensual;
    this.totalAPagar = this.cuotaEstimada * this.plazo;
    this.totalSeguros = (costoDesgravamenMensual + costoOptativoMensual) * this.plazo;
    this.totalIntereses = this.totalAPagar - this.monto - this.totalSeguros;
  }

  abrirModalContacto() {
    alert(`Simulación Procesada.\nMonto: S/. ${this.monto}\nTEA: ${this.tea}%\nCuota: S/. ${this.cuotaEstimada.toFixed(2)}`);
  }
}
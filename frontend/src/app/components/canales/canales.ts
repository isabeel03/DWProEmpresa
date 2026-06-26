import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Agencia {
  region: string;
  nombre: string;
  direccion: string;
  horario: string;
}

@Component({
  selector: 'app-canales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './canales.html',
  styleUrl: './canales.css'
  })
export class CanalesComponent {
  canalAbierto: string | null = null;
  regionSeleccionada: string = '';
  agenciasFiltradas: Agencia[] = [];

  private listaAgencias: Agencia[] = [
    { region: 'lima', nombre: 'Agencia Principal Lima', direccion: 'Av. Paseo de la República 3211, San Isidro', horario: 'Lun-Vie 9am a 6pm | Sáb 9am a 1pm' },
    { region: 'lima', nombre: 'Oficina Los Olivos', direccion: 'Av. Carlos Izaguirre 743', horario: 'Lun-Vie 9am a 6pm' },
    { region: 'junin', nombre: 'Agencia Huancayo', direccion: 'Calle Real 455, Huancayo', horario: 'Lun-Vie 9am a 6pm | Sáb 9am a 1pm' },
    { region: 'ica', nombre: 'Agencia Ica', direccion: 'Av. J.J. Elías 142', horario: 'Lun-Vie 9am a 6pm' }
  ];

  toggleCanal(canal: string) {
    this.canalAbierto = this.canalAbierto === canal ? null : canal;
    if (canal === 'encuentranos') {
      this.regionSeleccionada = '';
      this.agenciasFiltradas = [];
    }
  }

  filtrarAgencias() {
    if (!this.regionSeleccionada) {
      this.agenciasFiltradas = [];
      return;
    }
    this.agenciasFiltradas = this.listaAgencias.filter(
      ag => ag.region === this.regionSeleccionada
    );
  }
}
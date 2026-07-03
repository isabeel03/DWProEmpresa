import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-reporte-resumen',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reporte-resumen.html',
  styleUrls: ['./reporte-resumen.css']
})
export class ReporteResumen implements OnInit {
  semaforo = { Verde: 0, Amarillo: 0, Rojo: 0 };
  carteraTotal = 0;
  carteraVigente = 0;
  ratioMora = 0;
  cargando = true;

  constructor(private ds: DataService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    forkJoin({
      resumen: this.ds.getReporteData('resumen'),
      desembolsos: this.ds.getReporteData('desembolsos')
    }).subscribe({
      next: ({ resumen, desembolsos }) => {
        this.semaforo = {
          Verde: resumen.Verde || 0,
          Amarillo: resumen.Amarillo || 0,
          Rojo: resumen.Rojo || 0
        };

        const lista = Array.isArray(desembolsos) ? desembolsos : [];
        this.carteraTotal = lista.reduce((acc: number, c: any) => acc + (c.monto_desembolsado || 0), 0);
        this.carteraVigente = lista
          .filter((c: any) => !c.dias_mora || c.dias_mora === 0)
          .reduce((acc: number, c: any) => acc + (c.monto_desembolsado || 0), 0);
        this.ratioMora = this.carteraTotal > 0
          ? ((this.carteraTotal - this.carteraVigente) / this.carteraTotal) * 100
          : 0;

        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  get totalSolicitudes(): number {
    return this.semaforo.Verde + this.semaforo.Amarillo + this.semaforo.Rojo;
  }

  porcentaje(valor: number): number {
    return this.totalSolicitudes > 0 ? (valor / this.totalSolicitudes) * 100 : 0;
  }
}

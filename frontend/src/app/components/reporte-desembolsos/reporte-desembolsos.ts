import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-reporte-desembolsos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reporte-desembolsos.html',
  styleUrls: ['./reporte-desembolsos.css']
})
export class ReporteDesembolsos implements OnInit {
  creditos: any[] = [];
  cargando = true;

  constructor(private ds: DataService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.ds.getReporteData('desembolsos').subscribe({
      next: (res: any[]) => {
        this.creditos = (Array.isArray(res) ? res : [])
          .slice()
          .sort((a, b) => (b.monto_desembolsado || 0) - (a.monto_desembolsado || 0));
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  get montoMaximo(): number {
    return this.creditos.reduce((max, c) => Math.max(max, c.monto_desembolsado || 0), 0);
  }

  alturaBarra(monto: number): number {
    return this.montoMaximo > 0 ? (monto / this.montoMaximo) * 100 : 0;
  }
}

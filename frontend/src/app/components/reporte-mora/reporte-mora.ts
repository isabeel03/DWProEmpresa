import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-reporte-mora',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reporte-mora.html',
  styleUrls: ['./reporte-mora.css']
})
export class ReporteMora implements OnInit {
  creditos: any[] = [];
  cargando = true;

  constructor(private ds: DataService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.ds.getReporteData('mora').subscribe({
      next: (res: any[]) => {
        this.creditos = Array.isArray(res) ? res : [];
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  bandaClase(banda: string): string {
    if (banda === 'Judicial' || banda === 'Castigo') return 'banda-alto';
    if (!banda) return 'banda-medio';
    return 'banda-medio';
  }
}

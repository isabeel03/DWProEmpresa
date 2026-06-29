import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-reporte-resumen',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxChartsModule],
  templateUrl: './reporte-resumen.html',
  styleUrls: ['./reporte-resumen.css']
})
export class ReporteResumen implements OnInit {
  data: any[] = [];
  constructor(private ds: DataService) {}
  ngOnInit() {
    this.ds.getReporteData('resumen').subscribe(res => {
      this.data = res.map((i: any) => ({ name: i.semaforo_riesgo, value: parseInt(i.total) }));
    });
  }
}
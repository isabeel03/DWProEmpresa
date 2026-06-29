import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-reporte-desembolsos',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxChartsModule],
  templateUrl: './reporte-desembolsos.html',
  styleUrls: ['./reporte-desembolsos.css']
})
export class ReporteDesembolsos implements OnInit {
  data: any[] = [];
  constructor(private ds: DataService) {}
  ngOnInit() {
    this.ds.getReporteData('desembolsos').subscribe(res => {
      this.data = res.map((i: any) => ({ name: i.cliente, value: parseFloat(i.monto) }));
    });
  }
}
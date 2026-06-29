import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-reporte-mora',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxChartsModule],
  templateUrl: './reporte-mora.html',
  styleUrls: ['./reporte-mora.css']
})
export class ReporteMora implements OnInit {
  data: any[] = [];
  constructor(private ds: DataService) {}
  ngOnInit() {
    this.ds.getReporteData('mora').subscribe(res => {
      this.data = res.map((i: any) => ({ name: i.banda_mora, value: parseInt(i.total) }));
    });
  }
}
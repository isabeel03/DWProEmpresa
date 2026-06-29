import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteDesembolsos } from './reporte-desembolsos';

describe('ReporteDesembolsos', () => {
  let component: ReporteDesembolsos;
  let fixture: ComponentFixture<ReporteDesembolsos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteDesembolsos],
    }).compileComponents();

    fixture = TestBed.createComponent(ReporteDesembolsos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

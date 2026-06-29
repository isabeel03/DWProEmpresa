import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteResumen } from './reporte-resumen';

describe('ReporteResumen', () => {
  let component: ReporteResumen;
  let fixture: ComponentFixture<ReporteResumen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteResumen],
    }).compileComponents();

    fixture = TestBed.createComponent(ReporteResumen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

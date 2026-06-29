import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteMora } from './reporte-mora';

describe('ReporteMora', () => {
  let component: ReporteMora;
  let fixture: ComponentFixture<ReporteMora>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteMora],
    }).compileComponents();

    fixture = TestBed.createComponent(ReporteMora);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

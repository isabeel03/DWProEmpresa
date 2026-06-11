import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Canales } from './canales';

describe('Canales', () => {
  let component: Canales;
  let fixture: ComponentFixture<Canales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Canales],
    }).compileComponents();

    fixture = TestBed.createComponent(Canales);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployedReservationComponent } from './employed-reservation-component';

describe('EmployedReservationComponent', () => {
  let component: EmployedReservationComponent;
  let fixture: ComponentFixture<EmployedReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployedReservationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployedReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

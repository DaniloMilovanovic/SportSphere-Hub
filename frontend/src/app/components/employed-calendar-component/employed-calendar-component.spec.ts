import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployedCalendarComponent } from './employed-calendar-component';

describe('EmployedCalendarComponent', () => {
  let component: EmployedCalendarComponent;
  let fixture: ComponentFixture<EmployedCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployedCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployedCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

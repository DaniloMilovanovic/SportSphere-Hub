import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployedReportComponent } from './employed-report-component';

describe('EmployedReportComponent', () => {
  let component: EmployedReportComponent;
  let fixture: ComponentFixture<EmployedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployedReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployedFacilityCreationComponent } from './employed-facility-creation-component';

describe('EmployedFacilityCreationComponent', () => {
  let component: EmployedFacilityCreationComponent;
  let fixture: ComponentFixture<EmployedFacilityCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployedFacilityCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployedFacilityCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

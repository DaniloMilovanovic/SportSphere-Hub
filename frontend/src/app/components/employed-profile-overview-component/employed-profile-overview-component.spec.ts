import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployedProfileOverviewComponent } from './employed-profile-overview-component';

describe('EmployedProfileOverviewComponent', () => {
  let component: EmployedProfileOverviewComponent;
  let fixture: ComponentFixture<EmployedProfileOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployedProfileOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployedProfileOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

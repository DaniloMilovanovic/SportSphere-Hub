import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteProfileOverviewComponent } from './athlete-profile-overview-component';

describe('AthleteProfileOverviewComponent', () => {
  let component: AthleteProfileOverviewComponent;
  let fixture: ComponentFixture<AthleteProfileOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AthleteProfileOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AthleteProfileOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

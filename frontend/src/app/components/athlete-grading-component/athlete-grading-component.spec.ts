import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteGradingComponent } from './athlete-grading-component';

describe('AthleteGradingComponent', () => {
  let component: AthleteGradingComponent;
  let fixture: ComponentFixture<AthleteGradingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AthleteGradingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AthleteGradingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

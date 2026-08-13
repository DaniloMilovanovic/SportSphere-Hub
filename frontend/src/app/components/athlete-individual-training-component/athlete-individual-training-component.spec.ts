import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteIndividualTrainingComponent } from './athlete-individual-training-component';

describe('AthleteIndividualTrainingComponent', () => {
  let component: AthleteIndividualTrainingComponent;
  let fixture: ComponentFixture<AthleteIndividualTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AthleteIndividualTrainingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AthleteIndividualTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

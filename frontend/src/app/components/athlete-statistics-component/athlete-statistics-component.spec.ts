import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteStatisticsComponent } from './athlete-statistics-component';

describe('AthleteStatisticsComponent', () => {
  let component: AthleteStatisticsComponent;
  let fixture: ComponentFixture<AthleteStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AthleteStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AthleteStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

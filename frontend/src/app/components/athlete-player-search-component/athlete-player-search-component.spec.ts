import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AthletePlayerSearchComponent } from './athlete-player-search-component';

describe('AthletePlayerSearchComponent', () => {
  let component: AthletePlayerSearchComponent;
  let fixture: ComponentFixture<AthletePlayerSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AthletePlayerSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AthletePlayerSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

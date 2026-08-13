import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployedPromotionShopComponent } from './employed-promotion-shop-component';

describe('EmployedPromotionShopComponent', () => {
  let component: EmployedPromotionShopComponent;
  let fixture: ComponentFixture<EmployedPromotionShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployedPromotionShopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployedPromotionShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

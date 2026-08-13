import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { Promotion } from '../../models/promotion';
import { Equipment } from '../../models/equipment';
import { Order } from '../../models/order';
import { FacilityService } from '../../services/facility-service';
import { User } from '../../models/user';
import { Facility } from '../../models/facility';
import { ShopService } from '../../services/shop-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-employed-promotion-shop-component',
  imports: [FormsModule, DatePipe],
  templateUrl: './employed-promotion-shop-component.html',
  styleUrl: './employed-promotion-shop-component.css',
})
export class EmployedPromotionShopComponent {
  
  private router = inject(Router)
  private userService = inject(UserService)
  private facilityService = inject(FacilityService)
  private shopService = inject(ShopService)

  employed: User = new User()
  employedFacilities: Facility[] = []
  allSports: String[] = []
  promotions: Promotion[] = []
  equipment: Equipment[] = []
  orders: Order[] = []

  newPromotion: Promotion = new Promotion()
  selectedPromotion: Promotion = new Promotion()
  newEquipment: Equipment = new Equipment()
  selectedEquipmentImage: File | null = null;

  createPromotionMessage: String = ""
  updatePromotionMessage: String = ""
  createEquipmentMessage: String = ""
  updateEquipmentMessage: String = ""
  updateOrderMessage: String = ""

  createPromotionError: String = ""
  updatePromotionError: String = ""
  createEquipmentError: String = ""
  updateEquipmentError: String = ""
  updateOrderError: String = ""

  ngOnInit(){
    this.userService.setPreviousPath("")
    this.employed = this.userService.getUser();

    this.loadData()
  }

  loadData(){
    this.userService.getAvailableSports().subscribe(data =>{
      this.allSports = data
    })
    this.userService.getEmployedFacilities(this.employed.username).subscribe(facilities =>{
      this.employedFacilities = facilities;

      this.facilityService.getFacilityPromotions(facilities).subscribe(data =>{
        this.promotions = data
      })
    })
    this.shopService.getEquipment().subscribe(data => {
      this.equipment = data;
    })

    this.shopService.getAllOrders().subscribe(data =>{
      this.orders = data;
    })

  }

  createPromotion(){
    if(!this.newPromotion.name || !this.newPromotion.facilityName || !this.newPromotion.sports){
      this.createPromotionError = "Popunite naziv, objekat i sport!";
      return;
    }
    if(!this.newPromotion.discountValue || this.newPromotion.discountValue.valueOf() <= 0){
      this.createPromotionError = "Unesite validnu vrednost popusta!";
      return;
    }
    if(!this.newPromotion.validFrom || !this.newPromotion.validTo){
      this.createPromotionError = "Izaberite period važenja!";
      return;
    }
    if(this.newPromotion.validFrom >= this.newPromotion.validTo){
      this.createPromotionError = "Datum početka mora biti pre datuma kraja!";
      return;
    }

    this.newPromotion.status = "active"
    this.facilityService.createPromotion(this.newPromotion).subscribe(data =>{
      this.createPromotionMessage = data;
      this.loadData();
    })
  }

  selectPromotion(promo: Promotion){
    this.selectedPromotion = promo;
  }

  updatePromotion(){
    if(!this.selectedPromotion.name || !this.selectedPromotion.facilityName || !this.selectedPromotion.sports){
      this.updatePromotionError = "Popunite naziv, objekat i sport!";
      return;
    }
    if(!this.selectedPromotion.discountValue || this.selectedPromotion.discountValue.valueOf() <= 0){
      this.updatePromotionError = "Unesite validnu vrednost popusta!";
      return;
    }
    if(!this.selectedPromotion.validFrom || !this.selectedPromotion.validTo){
      this.updatePromotionError = "Izaberite period važenja!";
      return;
    }
    if(this.selectedPromotion.validFrom >= this.selectedPromotion.validTo){
      this.updatePromotionError = "Datum početka mora biti pre datuma kraja!";
      return;
    }
    this.facilityService.updatePromotion(this.selectedPromotion).subscribe(data =>{
      this.updatePromotionMessage = data
      this.selectedPromotion = new Promotion()
      this.loadData()
    })
  }

  onEquipmentImageSelected(event: any) {
    this.selectedEquipmentImage = event.target.files[0];
  }

  addEquipment(){
    const formData = new FormData();
    formData.append('name', this.newEquipment.name.valueOf());
    formData.append('category', this.newEquipment.category.valueOf());
    formData.append('price', this.newEquipment.price.toString());
    formData.append('stock', this.newEquipment.stock.toString());
    if (this.selectedEquipmentImage) {
      formData.append('image', this.selectedEquipmentImage);
    }

    this.shopService.addEquipment(formData).subscribe(res => {
      this.createEquipmentMessage = res;
      this.loadData();
      this.newEquipment = new Equipment();
      this.selectedEquipmentImage = null;
    });
  }

  updateStock(eq: Equipment){
    this.shopService.updateEquipment(eq).subscribe(res => {
      this.updateEquipmentMessage = res.valueOf();
      this.loadData();
    });
  }

  updatePrice(eq: Equipment) {
    const newPrice = prompt('Nova cena:', eq.price.toString());
    if(newPrice){
      eq.price = parseInt(newPrice)
      this.shopService.updateEquipment(eq).subscribe(res => {
        this.updateEquipmentMessage = res.valueOf();
        this.loadData();
      });
    }
  }

  updateOrderStatus(order: Order, status: String){
    this.shopService.updateOrder(order, status).subscribe(data =>{
      this.updateOrderMessage = data;
      this.loadData()
    })
  }

  getOrderStatusText(status: String):String{
    switch(status){
      case 'ordered': return 'Naručeno';
      case 'picked_up': return 'Preuzeto';
      case 'cancelled': return 'Otkazano';
      default: return status;
    }
  }
}

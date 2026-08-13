import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { ShopService } from '../../services/shop-service';
import { FormsModule } from '@angular/forms';
import { Equipment } from '../../models/equipment';
import { CartItem } from '../../models/cartItem';
import { OrderItem } from '../../models/order';

@Component({
  selector: 'app-athlete-shop-component',
  imports: [FormsModule],
  templateUrl: './athlete-shop-component.html',
  styleUrl: './athlete-shop-component.css',
})
export class AthleteShopComponent {
  private router = inject(Router)
  private userService = inject(UserService)
  shopService = inject(ShopService)

  sports: String[] = []

  selectedSports: String[] = []

  equipment: Equipment[] = []

  message: String = ""

  ngOnInit(){
    this.userService.setPreviousPath("");
    this.userService.getAvailableSports().subscribe(data => {
      this.sports = data
    })
  }

  searchEquipment(){
    if(this.selectedSports.length == 0){
      this.selectedSports = this.sports
    }

    this.shopService.getEquipmentForSports(this.selectedSports).subscribe(data =>{
      if(data.length == 0)console.log("prazno")
      this.equipment = data
    })
  }

  addToCart(equipment: Equipment, count: String){
    let countInt = parseInt(count.valueOf())
    if(isNaN(countInt)){
      alert("Niste uneli broj!")
      return;
    }
    if(countInt < 1 || countInt > equipment.stock.valueOf()){
      alert("Količina je van dozvoljenog opsega!")
      return;
    }
    alert(this.shopService.addEquipmentToOrder(equipment, countInt));
  }

  discardItem(item: CartItem){
    this.shopService.cart = this.shopService.cart.filter(i => i.equipmentName != item.equipmentName)
    
    this.shopService.price = this.shopService.price.valueOf() - item.quantity.valueOf() * item.price.valueOf();
  }

  orderCart(){
    if(this.shopService.cart.length == 0){
      return;
    }
    let items: OrderItem[] = []
    this.shopService.cart.forEach(item => {
      let orderItem: OrderItem = new OrderItem()
      orderItem.equipmentName = item.equipmentName
      orderItem.quantity = item.quantity
      orderItem.price = item.price
      items.push(orderItem);
    })

    this.shopService.createOrder(this.userService.getUser().username, items, this.shopService.price).subscribe(data =>{
      this.message = "Porudžbina je uspešno napravljena."
      this.discardAllItemsFromCart()
    })
  }

  discardAllItemsFromCart(){
    this.shopService.cart = []
    this.shopService.price = 0;
  }
}

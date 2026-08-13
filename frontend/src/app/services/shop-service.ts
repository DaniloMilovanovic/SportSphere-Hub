import { inject, Injectable } from '@angular/core';
import { Order, OrderItem } from '../models/order';
import { HttpClient } from '@angular/common/http';
import { Equipment } from '../models/equipment';
import { CartItem } from '../models/cartItem';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  
  uri = 'http://localhost:4000/shop';

  cart: CartItem[] = [];
  price: Number = 0;

  private http = inject(HttpClient)

  addEquipmentToOrder(equipment: Equipment, count:Number){
    const existing = this.cart.find(item => item.equipmentName === equipment.name);

    if(existing){
      if(existing.quantity.valueOf() + count.valueOf() > equipment.stock.valueOf()){
        return "Ne možete naručiti više od " + equipment.stock + " predmeta";
      }
      else{
        existing.quantity = existing.quantity.valueOf() + count.valueOf();
        this.price = this.price.valueOf() + count.valueOf() * equipment.price.valueOf();
        return "Predmet uspešno dodat u korpu!"
      }
    }else{
      this.cart.push({
        equipmentName: equipment.name,
        quantity: count,
        price: equipment.price,
        image: equipment.image
      });
      this.price = this.price.valueOf() + count.valueOf() * equipment.price.valueOf();
      return "Predmet uspešno dodat u korpu!"
    }
  }
  
  getEquipment(){
    return this.http.get<Equipment[]>(`${this.uri}/getEquipment`);
  }
  getEquipmentForSports(sports: String[]){
    return this.http.post<Equipment[]>(`${this.uri}/getEquipmentForSports`, {sports: sports});
  }

  createOrder(username: String, items: OrderItem[], price: Number){
    const data = {
      username: username,
      items: items,
      price: price
    }
    return this.http.post<Boolean>(`${this.uri}/createOrder`, data);
  }

  getAllOrders(){
    return this.http.get<Order[]>(`${this.uri}/getAllOrders`);
  }

  getUserOrders(username: String){
    return this.http.post<Order[]>(`${this.uri}/getUserOrders`, {username: username});
  }

  updateOrder(order: Order, status: String){
    return this.http.post<String>(`${this.uri}/updateOrder`, {order: order, status: status});
  }

  updateEquipment(equipment: Equipment){
    return this.http.post<String>(`${this.uri}/updateEquipment`, {equipment: equipment});
  }

  addEquipment(formData: FormData){
    return this.http.post<String>(`${this.uri}/addEquipment`, formData);
  }

  getTotalEquipmentSpending(){
    return this.http.get<Number>(`${this.uri}/getTotalEquipmentSpending`);
  }

  getEquipmentSalesReport(username: String, year: Number, month: Number){
    const data = {
      username: username,
      year: year,
      month: month
    }
    return this.http.post(`${this.uri}/getEquipmentSalesReport`, data, { responseType: 'blob' });
  }
}

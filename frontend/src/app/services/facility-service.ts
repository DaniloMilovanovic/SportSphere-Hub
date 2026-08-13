import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Facility } from '../models/facility';
import { Promotion } from '../models/promotion';


@Injectable({
  providedIn: 'root',
})
export class FacilityService {
  uri = 'http://localhost:4000/facilities';

  private http = inject(HttpClient)

  facility: Facility = new Facility()

  selectedType: String = ""

  getActiveFacilityCount() {
    return this.http.get<Number>(`${this.uri}/getActiveFacilityCount`);
  }

  getTopFacilities(cnt: Number){
    const data = {
      number: cnt
    }
    return this.http.post<Facility[]>(`${this.uri}/getTopFacilities`, data);
  }

  getNPromotions(cnt: Number){
    const data = {
      number: cnt
    }
    return this.http.post<Promotion[]>(`${this.uri}/getNPromotions`, data);
  }

  getCitiesWithFacilities(){
    return this.http.get<String[]>(`${this.uri}/getCitiesWithFacilities`);
  }

  findFacilities(cities:String[], sports:String[], type:String){
    const data = {
      cities: cities,
      sports: sports,
      type: type
    }
    return this.http.post<Facility[]>(`${this.uri}/findFacilities`, data);
  }

  findFacilitiesAvailableToday(cities:String[], sports:String[], type:String){
    const data = {
      cities: cities,
      sports: sports,
      type: type
    }
    return this.http.post<Facility[]>(`${this.uri}/findFacilitiesAvailableToday`, data);
  }

  getPendingFacilities(){
    return this.http.get<Facility[]>(`${this.uri}/getPendingFacilities`);
  }

  updateFacilityStatus(f: Facility){
    return this.http.post<String>(`${this.uri}/updateFacilityStatus`, f);
  }

  getBookedSlots(facilityName: String, courtName: String, date: String) {
    return this.http.post<String[]>(`${this.uri}/getBookedSlots`, {facilityName, courtName, date});
  }

  bookReservation(data: any) {
    return this.http.post(`${this.uri}/bookReservation`, data);
  }

  getActiveFacilities(){
    return this.http.get<Facility[]>(`${this.uri}/getActiveFacilities`);
  }

  findUserFacilities(username: String){
    return this.http.post<Facility[]>(`${this.uri}/findUserFacilities`, {username: username});
  }

  getFacilityPromotions(facilities: Facility[]){
    return this.http.post<Promotion[]>(`${this.uri}/getFacilityPromotions`, {facilities: facilities});
  }

  createPromotion(promotion: Promotion){
    return this.http.post<String>(`${this.uri}/createPromotion`, {promotion: promotion});
  }
  
  updatePromotion(promotion: Promotion){
    return this.http.post<String>(`${this.uri}/updatePromotion`, {promotion: promotion});
  }

  createFacility(facility: Facility){
    return this.http.post<String>(`${this.uri}/createFacility`, {facility: facility});
  }

  updateFacility(facility: Facility){
    return this.http.post<String>(`${this.uri}/updateFacility`, {facility: facility});
  }

  getOccupancyReport(facilityName: String, year: Number, month: Number){
    const data = {
      facilityName: facilityName,
      year: year,
      month: month
    }
    return this.http.post(`${this.uri}/getOccupancyReport`, data, { responseType: 'blob' });
  }
}
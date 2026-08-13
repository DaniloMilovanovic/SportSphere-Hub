import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Reservation } from '../models/reservation';
import { Advertisement, UserRequest } from '../models/advertisement';
import { User } from '../models/user';
import { TrainingSession } from '../models/TrainingSession';
import { Review } from '../models/review';
import { Facility } from '../models/facility';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  
  uri = 'http://localhost:4000/reservations';

  private http = inject(HttpClient)
  
  getAllReservations(){
    return this.http.get<Reservation[]>(`${this.uri}/getAllReservations`);
  }

  getUserReservations(u: String){
    const data = {
      username: u
    }
    return this.http.post<Reservation[]>(`${this.uri}/getUserReservations`, data);
  }

  updateReservationStatus(r: Reservation, status: String){
    r.status = status
    return this.http.post<String>(`${this.uri}/updateReservationStatus`, r);
  }

  getBookedSlotsForWeek(facilityName: String, courtName: String, startDate: String, endDate: String){
    const data = {
      facilityName: facilityName,
      courtName: courtName,
      startDate: startDate,
      endDate: endDate
    }
    return this.http.post<any[]>(`${this.uri}/getBookedSlotsForWeek`, data);
  }

  bookReservation(reservations: any) {
    return this.http.post<Boolean>(`${this.uri}/bookReservation`, reservations);
  }

  createAdvertisement(a:String, c: String, s:String, d:String, num: Number, start:String, end:String){
    
    const data = {
      authorUsername: a,
      city: c,
      sport: s,
      date: d.split('T')[0],
      missingPlayers: num,
      startTime: start,
      endTime: end
    }

    return this.http.post<Boolean>(`${this.uri}/createAdvertisement`, data);
  }

  getUserAdvertisements(u: String){
    return this.http.post<Advertisement[]>(`${this.uri}/getUserAdvertisements`, {user: u});
  }

  getAllAdvertisements(){
    return this.http.get<Advertisement[]>(`${this.uri}/getAllAdvertisements`);
  }

  getAdvertisementRequests(u: String){
    return this.http.post<Advertisement[]>(`${this.uri}/getAdvertisementRequests`, {username: u});
  }

  sendJoinRequest(ad: Advertisement, username:String){
    const data = {
      adId: ad._id,
      username: username
    }
    return this.http.post<{success: boolean, message: string}>(`${this.uri}/sendJoinRequest`, data);
  }

  disableAdvertisement(ad: Advertisement){
    const data = {
      adId: ad._id,
    }
    console.log(ad._id)

    return this.http.post<String>(`${this.uri}/disableAdvertisement`, data);
  }

  changeRequestStatus(ad: Advertisement, username: String, status: String){
    const data = {
      adId: ad._id,
      username: username,
      status: status
    }

    return this.http.post<String>(`${this.uri}/changeRequestStatus`, data);
  }

  scheduleTraining(data: any){
    return this.http.post<String>(`${this.uri}/scheduleTraining`, data);
  }

  getUserTrainings(name: String){
    return this.http.post<TrainingSession[]>(`${this.uri}/getUserTrainings`, {user: name});
  }

  getFacilityReviews(name: String){
    return this.http.post<Review[]>(`${this.uri}/getFacilityReviews`, {facilityName: name});
  }

  getConfirmedReservationsForUser(user: String){
    return this.http.post<Reservation[]>(`${this.uri}/getConfirmedReservationsForUser`, {username: user});
  }

  getUserReviews(user: String){
    return this.http.post<Review[]>(`${this.uri}/getUserReviews`, {username: user});
  }

  addReview(user:String, facilityName: String, type: String, comment: String){
    const data = {
      username: user,
      facilityName: facilityName,
      type: type,
      comment: comment
    }
    console.log(user);
    return this.http.post<Boolean>(`${this.uri}/addReview`, data);
  }

  getCommentableFacilities(username: String){
    return this.http.post<Facility[]>(`${this.uri}/getCommentableFacilities`, {username: username});
  }

  getEmployedFacilityReservations(username: String){
    return this.http.post<Reservation[]>(`${this.uri}/getEmployedFacilityReservations`, {username: username});
  }

  getEmployedFacilityTrainings(username: String){
    return this.http.post<TrainingSession[]>(`${this.uri}/getEmployedFacilityTrainings`, {username: username});
  }

  updateTrainingSessionStatus(session: TrainingSession, status: String){
    session.status = status;

    return this.http.post<String>(`${this.uri}/updateTrainingSessionStatus`, session);
  }

  getTrainingSessionsForWeek(facilityName: String, courtName: String, startDate: String, endDate: String){
    const data = {
      facilityName: facilityName,
      courtName: courtName,
      startDate: startDate,
      endDate: endDate
    }
    return this.http.post<any[]>(`${this.uri}/getTrainingSessionsForWeek`, data);
  }

  getUserSports(username: String){
    return this.http.post<any>(`${this.uri}/getUserSports`, {username: username});
  }

  getMonthlyActivity(year: Date, username: String){
    return this.http.post<Number[]>(`${this.uri}/getMonthlyActivity`, {username: username, year: year.getFullYear()});
  }
}

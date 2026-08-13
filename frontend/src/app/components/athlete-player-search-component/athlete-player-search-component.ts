import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Advertisement } from '../../models/advertisement';
import { User } from '../../models/user';
import { FacilityService } from '../../services/facility-service';
import { ReservationService } from '../../services/reservation-service';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-athlete-player-search-component',
  imports: [FormsModule, DatePipe],
  templateUrl: './athlete-player-search-component.html',
  styleUrl: './athlete-player-search-component.css',
})
export class AthletePlayerSearchComponent {
    private router = inject(Router)
  private userService = inject(UserService)
  private facilityService = inject(FacilityService)
  private reservationService = inject(ReservationService)

  currentUser:User = new User()
  cities: String[] = []
  sports: String[] = []
  selectedCity: String = ""
  selectedSport: String = ""
  selectedDate: String = ""
  startHour: String = ""
  endHour: String = ""
  numPlayers: String = ""
  
  formEndHourOptions: Number[] = [];

  userAdvertisementRequests: Advertisement[] = [];
  allAdvertisements: Advertisement[] = [];

  createMessage: String = ""
  joinMessage: String = ""

  advertisementRequestMessage: String = "";

  ngOnInit(){
    
    this.userService.setPreviousPath("")

    this.currentUser = this.userService.getUser()
    this.facilityService.getCitiesWithFacilities().subscribe(data => this.cities = data)
    
    this.userService.getAvailableSports().subscribe(data => this.sports = data)

    this.reservationService.getAllAdvertisements().subscribe(data => {
      this.allAdvertisements = data
    })

    this.reservationService.getAdvertisementRequests(this.currentUser.username).subscribe(data =>{
      this.userAdvertisementRequests = data
    })

  }

  generateAdvertisement(){

    let nums = parseInt(this.numPlayers.valueOf());

    this.reservationService.createAdvertisement(this.currentUser.username, this.selectedCity, this.selectedSport, 
    this.selectedDate, nums, `${this.startHour.padStart(2, "0")}:00`, `${this.endHour.padStart(2, "0")}:00`).subscribe(data =>{

      this.reservationService.getAllAdvertisements().subscribe(data =>{
        this.allAdvertisements = data
      })
        if(data)
          this.createMessage = "Uspešno je kreiran oglas!"
        else
          this.createMessage = "Nije kreiran oglas!"
    })
  }

  updateEndHourOptions(){

    if(!this.startHour){
      this.formEndHourOptions = [];
      this.endHour = "";
      return;
    }

    const start = parseInt(this.startHour.valueOf())
    const closeHour = 24;

    this.formEndHourOptions = [];

    for(let h = start + 1; h <= closeHour; h++){
      this.formEndHourOptions.push(h);
    }
  }

  get availableStartHours(): Number[]{
    const openHour = 0
    const closeHour = 24;
    
    const hours: number[] = [];
    for (let h = openHour; h < closeHour; h++) {
        hours.push(h);
    }
    return hours;
  }

  sendRequest(ad: Advertisement){
    this.reservationService.sendJoinRequest(ad, this.currentUser.username).subscribe(response =>{
        this.joinMessage = response.message;
        if(response.success){
          this.joinMessage = response.message;
        }else{
          this.joinMessage = response.message;
        }
    })
  }

  closeAd(ad: Advertisement){
    this.reservationService.disableAdvertisement(ad).subscribe(data =>{
      this.joinMessage = data
      this.reservationService.getAllAdvertisements().subscribe(data => {
        this.allAdvertisements = data
      })

      this.reservationService.getAdvertisementRequests(this.currentUser.username).subscribe(data =>{
        this.userAdvertisementRequests = data
      })
    })
  }

  approveRequest(ad: Advertisement, username: String){
    this.reservationService.changeRequestStatus(ad, username, "approved").subscribe(data => {
      this.advertisementRequestMessage = data;

      this.reservationService.getAdvertisementRequests(this.currentUser.username).subscribe(data =>{
        this.userAdvertisementRequests = data
      })
      
      this.reservationService.getAllAdvertisements().subscribe(data => {
        this.allAdvertisements = data
      })
    })
  }

  rejectRequest(ad: Advertisement, username: String){
    this.reservationService.changeRequestStatus(ad, username, "rejected").subscribe(data => {
      this.advertisementRequestMessage = data;

      this.reservationService.getAdvertisementRequests(this.currentUser.username).subscribe(data =>{
        this.userAdvertisementRequests = data
      })
      
      this.reservationService.getAllAdvertisements().subscribe(data => {
        this.allAdvertisements = data
      })
    })
  }
}

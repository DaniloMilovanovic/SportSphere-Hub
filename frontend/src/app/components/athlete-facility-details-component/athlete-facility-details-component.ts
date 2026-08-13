import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Facility } from '../../models/facility';
import { Review } from '../../models/review';
import { FacilityService } from '../../services/facility-service';
import { ReservationService } from '../../services/reservation-service';
import { UserService } from '../../services/user-service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';


declare var L: any;

@Component({
  selector: 'app-athlete-facility-details-component',
  imports: [FormsModule, DatePipe],
  templateUrl: './athlete-facility-details-component.html',
  styleUrl: './athlete-facility-details-component.css',
})
export class AthleteFacilityDetailsComponent {

  private router = inject(Router);
  private userService = inject(UserService);
  private facilityService = inject(FacilityService);
  private reservationService = inject(ReservationService)

  facility: Facility = new Facility();
  
  private map: any;

  message: String = ""
  
  weekDays: any[] = [];
  hours: number[] = [];
  currentWeekStart: Date = new Date();
  weekRange: string = "";
  selectedSlots: any[] = [];
  bookedSlots: any[] = [];

  selectedCourt: any = null;
  filteredCourts: any[] = [];
  currentCourtIndex: number = 0;

  formDate: string = "";
  formStartHour: string = "";
  formEndHour: string = "";
  formEndHourOptions: number[] = [];

  reviews: Review[] = [];

  ngOnInit(){
    this.userService.setPreviousPath("athleteReservation")
    this.facility = this.facilityService.facility

    this.filterCourts();
    if(this.filteredCourts.length > 0){
      this.selectedCourt = this.filteredCourts[0];
    }

    this.currentWeekStart = this.getMonday(new Date());
    this.generateHours();
    this.buildWeek();

    this.loadFacilityReviews();
  }

  ngAfterViewInit(){
    this.initMap();
  }

  initMap(){
    if(this.facility.location && this.facility.location.coordinates){
      const [lng, lat] = this.facility.location.coordinates;
      this.map = L.map("map").setView([lat, lng], 15);
      
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{}).addTo(this.map);
      
      L.marker([lat, lng]).addTo(this.map)
        .bindPopup(this.facility.name)
        .openPopup();
    }
  }

  filterCourts(){
    this.filteredCourts = this.facility.courts.filter(c => c.status == "active");
  }

  previousCourt(){
    if(this.filteredCourts.length <= 1) return;
    this.currentCourtIndex = (this.currentCourtIndex - 1 + this.filteredCourts.length) % this.filteredCourts.length;
    this.selectedCourt = this.filteredCourts[this.currentCourtIndex];
    this.buildWeek();
  }

  nextCourt(){
    if(this.filteredCourts.length <= 1) return;
    this.currentCourtIndex = (this.currentCourtIndex + 1) % this.filteredCourts.length;
    this.selectedCourt = this.filteredCourts[this.currentCourtIndex];
    this.buildWeek();
  }

  getMonday(date: Date): Date{
    const d = new Date(date);
    const day = d.getUTCDay();
    const diff = d.getUTCDate() - day + (day == 0 ? -6 : 1);
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), diff));
  }

  generateHours(){
    this.hours = [];
    for(let h = 0; h < 24; h++){
      this.hours.push(h);
    }
  }

  buildWeek(){
    this.weekDays = [];
    const dayNames = ["Pon", "Uto", "Sre", "Čet", "Pet", "Sub", "Ned"];
    
    for(let i = 0; i < 7; i++){
      const date = new Date(Date.UTC(
        this.currentWeekStart.getUTCFullYear(),
        this.currentWeekStart.getUTCMonth(),
        this.currentWeekStart.getUTCDate() + i
      ));
      this.weekDays.push({
        name: dayNames[i],
        date: date
      });
    }

    const endDate = new Date(Date.UTC(
      this.currentWeekStart.getUTCFullYear(),
      this.currentWeekStart.getUTCMonth(),
      this.currentWeekStart.getUTCDate() + 6
    ));
    
    this.weekRange = `${this.currentWeekStart.getUTCDate()}.${this.currentWeekStart.getUTCMonth() + 1}.${this.currentWeekStart.getUTCFullYear()} - ${endDate.getUTCDate()}.${endDate.getUTCMonth() + 1}.${endDate.getUTCFullYear()}`;
    
    this.loadBookedSlots();
  }

  previousWeek(){
    this.currentWeekStart = new Date(Date.UTC(
      this.currentWeekStart.getUTCFullYear(),
      this.currentWeekStart.getUTCMonth(),
      this.currentWeekStart.getUTCDate() - 7
    ));
    this.buildWeek();
  }

  nextWeek(){
    this.currentWeekStart = new Date(Date.UTC(
      this.currentWeekStart.getUTCFullYear(),
      this.currentWeekStart.getUTCMonth(),
      this.currentWeekStart.getUTCDate() + 7
    ));
    this.buildWeek();
  }

  isSlotBooked(date: Date, hour: number): boolean{
    return this.bookedSlots.some(slot => 
      this.sameDay(slot.date, date) && slot.hour === hour
    );
  }

  isSlotSelected(date: Date, hour: number): boolean {
    return this.selectedSlots.some(slot => 
      this.sameDay(slot.date, date) && slot.hour === hour
    );
  }

  isWithinWorkingHours(hour: number): boolean{
    const openHour = parseInt(this.facility.workingHours?.open?.split(':')[0] || '0');
    const closeHour = parseInt(this.facility.workingHours?.close?.split(':')[0] || '24');
    return hour >= openHour && hour < closeHour;
  }

  sameDay(d1: Date, d2: Date): boolean{
    return d1.getUTCFullYear() === d2.getUTCFullYear() &&d1.getUTCMonth() === d2.getUTCMonth() && d1.getUTCDate() === d2.getUTCDate();
  }

  onSlotClick(date: Date, hour: number){
    if(!this.isWithinWorkingHours(hour)) return;
    if(this.isSlotBooked(date, hour)) return;

    const index = this.selectedSlots.findIndex(slot => 
      this.sameDay(slot.date, date) && slot.hour === hour
    );

    if(index > -1){
      if (index === 0 || index === this.selectedSlots.length - 1) {
        this.selectedSlots.splice(index, 1);
      }
      return;
    }

    if(this.selectedSlots.length === 0){
      this.selectedSlots.push({date, hour});
      return;
    }

    if(!this.sameDay(this.selectedSlots[0].date, date)){
      this.selectedSlots = [{date, hour}];
      return;
    }

    const sorted = [...this.selectedSlots].sort((a, b) => a.hour - b.hour);
    const firstHour = sorted[0].hour;
    const lastHour = sorted[sorted.length - 1].hour;

    if(hour === firstHour - 1){
      this.selectedSlots.push({date, hour});
    }else if(hour === lastHour + 1){
      this.selectedSlots.push({date, hour});
    }else{
      this.selectedSlots = [{date, hour}];
    }
  }

  loadBookedSlots(){
    if(!this.selectedCourt || !this.facility.name) return;

    const startDate = this.weekDays[0].date.toISOString();
    const endDate = this.weekDays[6].date.toISOString();
    
    
    this.bookedSlots = [];

    this.reservationService.getBookedSlotsForWeek(this.facility.name, this.selectedCourt.name, startDate, endDate)
    .subscribe((booked: any[]) => {
      booked.forEach(b => {
        const bookingDate = new Date(b.date);
        const startHour = parseInt(b.startTime.split(":")[0]);
        const endHour = parseInt(b.endTime.split(":")[0]);
        for(let h = startHour; h < endHour; h++){
          this.bookedSlots.push({
            date: bookingDate,
            hour: h
          });
        }
      });
    });

    this.reservationService.getTrainingSessionsForWeek(this.facility.name, this.selectedCourt.name, startDate, endDate)
    .subscribe((trainings: any[]) => {
      trainings.forEach(t => {
        const trainingDate = new Date(t.date);
        const startHour = parseInt(t.startTime.split(":")[0]);
        const endHour = parseInt(t.endTime.split(":")[0]);
        for(let h = startHour; h < endHour; h++){
          this.bookedSlots.push({ date: trainingDate, hour: h });
        }
      });
    });
  }

  bookSelectedSlots(){
    if (this.selectedSlots.length === 0) {
      this.message = "Niste izabrali termin.";
      return;
    }

    const sorted = [...this.selectedSlots].sort((a, b) => a.hour - b.hour);
    const startHour = sorted[0].hour;
    const endHour = sorted[sorted.length - 1].hour + 1;

    const utcDate = sorted[0].date.toISOString();

    const data = {
      username: this.userService.getUser().username,
      facilityName: this.facility.name,
      city: this.facility.city,
      courtName: this.selectedCourt.name,
      sport: this.selectedCourt.sport,
      date: utcDate,
      startTime: `${startHour.toString().padStart(2, "0")}:00`,
      endTime: `${endHour.toString().padStart(2, "0")}:00`
    };

    this.reservationService.bookReservation(data).subscribe({
      next: (res: any) => {
        alert(res);
        this.message = res;
        if(res === "Rezervacija uspešna!"){
          this.selectedSlots = [];
          this.buildWeek();
        }
      },
      error: () => {
        this.message = "Greška pri rezervaciji.";
        alert(this.message);
      }
    });
  }

  getStartHour(): number{
    if(this.selectedSlots.length === 0) return 0;
    return Math.min(...this.selectedSlots.map(s => s.hour));
  }

  getEndHour(): number{
    if(this.selectedSlots.length === 0) return 0;
    return Math.max(...this.selectedSlots.map(s => s.hour)) + 1;
  }

  get availableStartHours(): number[]{
    const openHour = parseInt(this.facility.workingHours?.open?.split(':')[0] || '0');
    const closeHour = parseInt(this.facility.workingHours?.close?.split(':')[0] || '24');
    
    const hours: number[] = [];
    for (let h = openHour; h < closeHour; h++) {
      hours.push(h);
    }

    return hours;
    }

  updateEndHourOptions(){
    if(!this.formStartHour){
      this.formEndHourOptions = [];
      this.formEndHour = "";
      return;
    }

    const start = parseInt(this.formStartHour);
    const closeHour = parseInt(this.facility.workingHours?.close?.split(':')[0] || '24');

    this.formEndHourOptions = [];
    for(let h = start + 1; h <= closeHour; h++){
      this.formEndHourOptions.push(h);
    }
  }

  bookViaForm(){
    if(!this.formDate || !this.formStartHour || !this.formEndHour){
      this.message = "Popunite sva polja.";
      return;
    }

    if(!this.selectedCourt){
      this.message = "Izaberite teren/halu.";
      return;
    }

    const startHour = parseInt(this.formStartHour);
    const endHour = parseInt(this.formEndHour);

    const formDateObj = new Date(this.formDate + "T00:00:00.000Z");
    /*
    for(let h = startHour; h < endHour; h++){
      if(this.isSlotBooked(formDateObj, h)){
        this.message = `Termin ${h}:00 je već rezervisan. Izaberite drugi termin.`;
        return;
      }
    }*/

    if(!this.isWithinWorkingHours(startHour) || !this.isWithinWorkingHours(endHour - 1)){
      this.message = "Izabrani termin je van radnog vremena.";
      return;
    }

    const utcDate = new Date(this.formDate + "T00:00:00.000Z").toISOString();

    const data = {
      username: this.userService.getUser().username,
      facilityName: this.facility.name,
      city: this.facility.city,
      courtName: this.selectedCourt.name,
      sport: this.selectedCourt.sport,
      date: utcDate,
      startTime: `${this.formStartHour.padStart(2, "0")}:00`,
      endTime: `${this.formEndHour.padStart(2, "0")}:00`
    };

    this.reservationService.bookReservation(data).subscribe({
      next: (res: any) => {
        alert(res);
        this.message = res;
        if(res === "Rezervacija uspešna!"){
          this.formDate = "";
          this.formStartHour = "";
          this.formEndHour = "";
          this.formEndHourOptions = [];
          this.buildWeek();
        }
      },
      error: () => {
        this.message = "Greška pri rezervaciji.";
        alert(this.message)
      }
    });
  }

  loadFacilityReviews(){
    console.log("Facility name:", this.facility.name);
    this.reservationService.getFacilityReviews(this.facility.name).subscribe(data => {
      this.reviews = data;
    });
  }

  getUser(){
    return this.userService.getUser()
  }
}

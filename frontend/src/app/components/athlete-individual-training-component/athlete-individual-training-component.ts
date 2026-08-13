import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Court, Facility } from '../../models/facility';
import { Trainer } from '../../models/trainer';
import { FacilityService } from '../../services/facility-service';
import { ReservationService } from '../../services/reservation-service';
import { TrainerService } from '../../services/trainer-service';
import { UserService } from '../../services/user-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-athlete-individual-training-component',
  imports: [FormsModule],
  templateUrl: './athlete-individual-training-component.html',
  styleUrl: './athlete-individual-training-component.css',
})
export class AthleteIndividualTrainingComponent {

  private router = inject(Router)
  private userService = inject(UserService)
  private facilityService = inject(FacilityService)
  private trainerService = inject(TrainerService)
  private reservationService = inject(ReservationService)

  trainers: Trainer[] = []
  sports: String[] = []
  facilities: Facility[] = []
  selectedSport: String = ""
  selectedFacility: Facility = new Facility()
  selectedCourts: Court[] = []
  selectedTrainer: Trainer | null = null
  selectedCourt: String = ""
  message = ""

  trainingDate: string = ""
  trainingStartHour: string = ""
  trainingEndHour: string = ""
  trainingEndHourOptions: number[] = []
  ngOnInit(){
    this.userService.setPreviousPath("")

    this.userService.getAvailableSports().subscribe(data =>
      this.sports = data
    )

    this.facilityService.getActiveFacilities().subscribe(data =>{
      this.facilities = data
    })
  }

  searchTrainers(){
    this.selectedCourt = ""
    this.selectedTrainer = new Trainer()
    this.trainerService.searchTrainers(this.selectedFacility.name, this.selectedSport).subscribe(data =>{
      this.trainers = data
    })
    this.selectedCourts = []
    this.selectedFacility.courts.forEach(court =>{
      if(court.sport == this.selectedSport){
        this.selectedCourts.push(court)
      }
    })
  }

  selectTrainer(trainer: Trainer){
    this.selectedTrainer = trainer
  }

  selectCourt(courtName: String){
    this.selectedCourt = courtName;
  }

  get availableStartHours(): Number[]{
    const hours: Number[] = [];
    for (let h = 0; h < 24; h++) {
      hours.push(h);
    }
    return hours;
  }
    
  updateTrainingEndHourOptions(){
    if(!this.trainingStartHour){
      this.trainingEndHourOptions = [];
      this.trainingEndHour = "";
      return;
    }
      
    const start = parseInt(this.trainingStartHour);
    const closeHour = 24;
    
    this.trainingEndHourOptions = [];
    for(let h = start + 1; h <= closeHour; h++){
      this.trainingEndHourOptions.push(h);
    }
  }
  
  getTotalPrice(): Number{
    if(!this.trainingStartHour || !this.trainingEndHour || !this.selectedTrainer){
      return 0;
    }
    const start = parseInt(this.trainingStartHour);
    const end = parseInt(this.trainingEndHour);
    const hours = end - start;
    return hours * (this.selectedTrainer.pricePerHour as number);
  }

  isWithinWorkingHours(hour: number): boolean{
    const openHour = parseInt(this.selectedFacility.workingHours?.open?.split(':')[0] || '0');
    const closeHour = parseInt(this.selectedFacility.workingHours?.close?.split(':')[0] || '24');
    return hour >= openHour && hour < closeHour;
  }
  
  scheduleTraining(){
    if(!this.trainingDate || !this.trainingStartHour || !this.trainingEndHour){
      this.message = "Popunite sva polja.";
      return;
    }
    
    if(!this.selectedTrainer){
      this.message = "Izaberite trenera.";
      return;
    }
    
    let startHour = parseInt(this.trainingStartHour)
    let endHour = parseInt(this.trainingEndHour)

    if(!this.isWithinWorkingHours(startHour) || !this.isWithinWorkingHours(endHour - 1)){
      this.message = "Izabrani termin je van radnog vremena.";
      return;
    }
    
    const totalPrice = this.getTotalPrice();
    
    const data = {
      athleteUsername: this.userService.getUser().username,
      trainerId: this.selectedTrainer._id,
      trainerFirstName: this.selectedTrainer.firstName,
      trainerLastName: this.selectedTrainer.lastName,
      sport: this.selectedSport,
      facilityName: this.selectedFacility.name,
      city: this.selectedFacility.city,
      courtName: this.selectedCourt,
      date: this.trainingDate,
      startTime: `${this.trainingStartHour.padStart(2, '0')}:00`,
      endTime: `${this.trainingEndHour.padStart(2, '0')}:00`,
      pricePerHour: this.selectedTrainer.pricePerHour,
      totalPrice: totalPrice
    };
    
    this.reservationService.scheduleTraining(data).subscribe(res => {
      this.message = res.valueOf();
      if(res == "Trening uspešno zakazan!"){
        this.trainingDate = "";
        this.trainingStartHour = "";
        this.trainingEndHour = "";
        this.trainingEndHourOptions = [];
        this.selectedTrainer = null;
      }
    });
  }
}


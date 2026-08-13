import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReservationService } from '../../services/reservation-service';
import { UserService } from '../../services/user-service';
import { Reservation } from '../../models/reservation';
import { DatePipe } from '@angular/common';
import { TrainingSession } from '../../models/TrainingSession';

@Component({
  selector: 'app-employed-reservation-component',
  imports: [FormsModule, DatePipe],
  templateUrl: './employed-reservation-component.html',
  styleUrl: './employed-reservation-component.css',
})
export class EmployedReservationComponent {
  private router = inject(Router)
  private userService = inject(UserService)
  private reservationService = inject(ReservationService)

  reservations: Reservation[] = []
  trainingSessions: TrainingSession[] = []
  
  ngOnInit(){
    this.userService.setPreviousPath("")
    this.reservationService.getEmployedFacilityReservations(this.userService.getUser().username).subscribe(data =>{
      this.reservations = data
    })

    this.reservationService.getEmployedFacilityTrainings(this.userService.getUser().username).subscribe(data =>{
      this.trainingSessions = data
    })
  }

  canConfirm(res: Reservation): boolean {
    if(res.status !== 'pending') return false;

    const now = new Date();
    const resDate = new Date(res.date);
    const [hours, minutes] = res.startTime.split(':');
    resDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const diffMinutes = (now.getTime() - resDate.getTime()) / (1000 * 60);
    
    return diffMinutes >= 0 && diffMinutes <= 10;
  }

  confirmReservation(res: Reservation){
    this.reservationService.updateReservationStatus(res, "confirmed").subscribe(data =>{
      this.reservationService.getEmployedFacilityReservations(this.userService.getUser().username).subscribe(data =>{
        this.reservations = data
      })
    });
  }

  markNoShow(res: Reservation){
    this.reservationService.updateReservationStatus(res, "no_show").subscribe(data =>{
      this.reservationService.getEmployedFacilityReservations(this.userService.getUser().username).subscribe(data =>{
        this.reservations = data
      })
    });
  }

  canConfirmTraining(session:TrainingSession){
    
    if(session.status !== 'scheduled') return false;

    const now = new Date();
    const resDate = new Date(session.date);
    const [hours, minutes] = session.startTime.split(':');
    resDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const diffMinutes = (now.getTime() - resDate.getTime()) / (1000 * 60);
    
    return diffMinutes >= -10 && diffMinutes <= 10;
  }

  confirmTraining(session: TrainingSession){
    this.reservationService.updateTrainingSessionStatus(session, "completed").subscribe(data =>{
      this.reservationService.getEmployedFacilityTrainings(this.userService.getUser().username).subscribe(data =>{
        this.trainingSessions = data
      })
    })
  }

  markTrainingNoShow(session: TrainingSession){
    this.reservationService.updateTrainingSessionStatus(session, "no_show").subscribe(data =>{
      this.reservationService.getEmployedFacilityTrainings(this.userService.getUser().username).subscribe(data =>{
        this.trainingSessions = data
      })
    })
  }

  
  getReservationStatusText(status: String): String{
    switch(status){
      case 'pending': return 'Na čekanju';
      case 'confirmed': return 'Potvrđena';
      case 'cancelled': return 'Otkazana';
      case 'no_show': return 'Nije došao';
      default: return status;
    }
  }

  
  getTrainingStatusText(status: String): String{
    switch(status){
      case 'scheduled': return 'Zakazano';
      case 'completed': return 'Završeno';
      case 'cancelled': return 'Otkazano';
      case 'no_show': return 'Nije došao';
      default: return status;
    }
  }
}

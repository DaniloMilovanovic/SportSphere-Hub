import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user-service';
import { Router } from '@angular/router';
import { Facility } from '../../models/facility';
import { FacilityService } from '../../services/facility-service';
import { ReservationService } from '../../services/reservation-service';
import { FormsModule } from '@angular/forms';
import { Review } from '../../models/review';
import { Reservation } from '../../models/reservation';

@Component({
  selector: 'app-athlete-grading-component',
  imports: [FormsModule],
  templateUrl: './athlete-grading-component.html',
  styleUrl: './athlete-grading-component.css',
})
export class AthleteGradingComponent {
  
  private router = inject(Router);
  private userService = inject(UserService);
  private facilityService = inject(FacilityService);
  private reservationService = inject(ReservationService)
  
  message: String = ""
  username: String = ""
  
  canReview: boolean = false;
  remainingReviews: number = 0;
  reviewComment: string = "";
  facility: Facility = new Facility()

  reviews: Review[] = []
  confirmedReservations: Reservation[] = []

  commentableFacilities: Facility[] = []

  selectedFacility: Facility = new Facility()
  commentText: String = ""

  ngOnInit(){
    this.username = this.userService.getUser().username;
    this.userService.setPreviousPath("")
    this.reservationService.getCommentableFacilities(this.userService.getUser().username).subscribe(data =>{
      this.commentableFacilities = data
    })
  }

  likeFacility(facility: Facility){
    this.reservationService.addReview(this.username, facility.name, "like", "").subscribe( data =>{
      this.message = "Uspešno dodata reakcija.";
      
      this.reservationService.getCommentableFacilities(this.userService.getUser().username).subscribe(data =>{
        this.commentableFacilities = data
      })
    })
  }

  dislikeFacility(facility: Facility){
    this.reservationService.addReview(this.username, facility.name, "dislike", "").subscribe( data =>{
      this.message = "Uspešno dodata reakcija.";
      
      this.reservationService.getCommentableFacilities(this.userService.getUser().username).subscribe(data =>{
        this.commentableFacilities = data
      })
    })
  }

  commentFacility(facility: Facility){
    this.selectedFacility = facility;
  }

  submitFacilityComment(facility: Facility){
    this.reservationService.addReview(this.username, facility.name, "", this.commentText).subscribe( data =>{
      this.message = "Uspešno dodat komentar.";
      this.selectedFacility = new Facility()
      
      this.reservationService.getCommentableFacilities(this.userService.getUser().username).subscribe(data =>{
        this.commentableFacilities = data
      })
    })
  }

  discardFacilityComment(facility: Facility){
    this.selectedFacility = new Facility()
  }

}

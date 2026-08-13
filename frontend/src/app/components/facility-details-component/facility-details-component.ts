import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FacilityService } from '../../services/facility-service';
import { Facility } from '../../models/facility';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-facility-details-component',
  imports: [],
  templateUrl: './facility-details-component.html',
  styleUrl: './facility-details-component.css',
})
export class FacilityDetailsComponent {
  private router = inject(Router)
  private facilityService = inject(FacilityService)
  private userService = inject(UserService)

  facility: Facility = new Facility()
  ngOnInit(){
    this.facility = this.facilityService.facility
    
    this.userService.setPreviousPath("welcome")
  }
}

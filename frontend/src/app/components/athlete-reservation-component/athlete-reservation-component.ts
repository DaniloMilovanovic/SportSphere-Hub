import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { Facility } from '../../models/facility';
import { FacilityService } from '../../services/facility-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-athlete-reservation-component',
  imports: [FormsModule],
  templateUrl: './athlete-reservation-component.html',
  styleUrl: './athlete-reservation-component.css',
})
export class AthleteReservationComponent {
  private router = inject(Router)
  private userService = inject(UserService)
  
  private facilityService = inject(FacilityService)

  numActive: Number = -1
  bestRated: Facility[] = []

  imageUrl: String = ""

  username: String = ""
  password: String = ""

  message: String = ""

  cities: String[] = []
  sports: String[] = []
  selectedCities: String[] = []
  selectedSports: String[] = []
  selectedType: String = ""
  availableToday: Boolean = false;

  returnedFacilities: Facility[] = []

  sortColumn: String = "";
  sortDirection: String = "asc";

  searched: Boolean = false;

  ngOnInit(){

    this.userService.setPreviousPath("")

    this.facilityService.getActiveFacilityCount().subscribe(data => this.numActive = data)

    this.facilityService.getTopFacilities(3).subscribe(data => this.bestRated = data)


    this.facilityService.getCitiesWithFacilities().subscribe(data => this.cities = data)
    
    this.userService.getAvailableSports().subscribe(data => this.sports = data)
  }

  findFacilities(){
    this.searched = true;
    if(this.availableToday){
      
      this.facilityService.findFacilitiesAvailableToday(this.selectedCities, this.selectedSports, this.selectedType).subscribe(
        data => this.returnedFacilities = data)
    }
    else{
      this.facilityService.findFacilities(this.selectedCities, this.selectedSports, this.selectedType).subscribe(
        data => this.returnedFacilities = data)
    }
  }

  sort(column: string){
    if(this.sortColumn == column){
        this.sortDirection = this.sortDirection == "asc" ? "desc" : "asc";
    }
    else{
        this.sortColumn = column;
        this.sortDirection = "asc";
    }

    this.returnedFacilities.sort((a: any, b: any) => {
        let valA = (a[column] || '').toString().toLowerCase();
        let valB = (b[column] || '').toString().toLowerCase();

        if(valA < valB) return this.sortDirection === "asc" ? -1 : 1;
        if(valA > valB) return this.sortDirection === "asc" ? 1 : -1;
        return 0;
    });
  }

  getSortArrow(column: string): string{
      if(this.sortColumn !== column) return '/';
      else return this.sortDirection === "asc" ? "ASC" : "DSC";
  }

  getDetails(facility:Facility){
    this.facilityService.facility = facility
    this.facilityService.selectedType = this.selectedType
    this.router.navigate(["athleteFacilityDetails"])
  }

}

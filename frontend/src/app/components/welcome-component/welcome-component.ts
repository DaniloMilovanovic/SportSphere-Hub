import { Component, inject } from '@angular/core';
import { Router, } from '@angular/router';
import { UserService } from '../../services/user-service';
import { FormsModule } from '@angular/forms';
import { Facility } from '../../models/facility';
import { DatePipe } from '@angular/common';
import { Promotion } from '../../models/promotion';
import { FacilityService } from '../../services/facility-service';

@Component({
  selector: 'app-welcome-component',
  imports: [FormsModule, DatePipe],
  templateUrl: './welcome-component.html',
  styleUrl: './welcome-component.css',
})
export class WelcomeComponent {
  private router = inject(Router)
  private userService = inject(UserService)
  private facilityService = inject(FacilityService)

  numActive: Number = -1
  bestRated: Facility[] = []

  imageUrl: String = ""

  username: String = ""
  password: String = ""

  message: String = ""

  promotions: Promotion[] = []

  cities: String[] = []
  sports: String[] = []
  selectedCities: String[] = []
  selectedSports: String[] = []
  selectedType: String = ""

  returnedFacilities: Facility[] = []

  sortColumn: String = "";
  sortDirection: String = "asc";

  searched: Boolean = false;

  ngOnInit(){
    
    this.userService.setPreviousPath("")

    this.facilityService.getActiveFacilityCount().subscribe(data => this.numActive = data)

    this.facilityService.getTopFacilities(3).subscribe(data => this.bestRated = data)

    this.facilityService.getNPromotions(3).subscribe(data => this.promotions = data)

    this.facilityService.getCitiesWithFacilities().subscribe(data => this.cities = data)
    
    this.userService.getAvailableSports().subscribe(data => this.sports = data)
  }

  checkNotLoggedIn(){
    return this.userService.getUser() == null
  }

  logIn(){
    if(this.username != "admin"){
      this.userService.logIntoSystem(this.username, this.password).subscribe(data =>{
        if(data != null){
          this.userService.setUser(data)
          this.username = ""
          this.password = ""
          this.message = ""
          window.scrollTo(0, 0);
        }
        else{
          this.message = "Netačni kredencijali!"
        }
      })
    }
    else{
      this.message = "Netačni kredencijali!"
    }
  }

  findFacilities(){
    this.searched = true
    this.facilityService.findFacilities(this.selectedCities, this.selectedSports, this.selectedType).subscribe(
      data => this.returnedFacilities = data)
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

      if(valA < valB) return this.sortDirection == "asc" ? -1 : 1;
      if(valA > valB) return this.sortDirection == "asc" ? 1 : -1;
      return 0;
    });
  }

  getSortArrow(column: string): string{
    if(this.sortColumn !== column) return '/';
    else return this.sortDirection === "asc" ? "ASC" : "DSC";
  }

  getDetails(facility:Facility){
    this.facilityService.facility = facility
    this.router.navigate(["facilityDetails"])
  }

  goToRegistration(){
    this.router.navigate(["registration"])
  }

  goToForgotPassword(){
    this.router.navigate(["forgotPassword"])
  }

  getLikeText(likes: number): string {
    if(likes % 10 === 1 && likes % 100 !== 11){
      return 'lajk';
    }
    else{
      return 'lajka';
    }
  }

}

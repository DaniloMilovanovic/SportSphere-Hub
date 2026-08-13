import { Component, inject } from '@angular/core';
import { FacilityService } from '../../services/facility-service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { FormsModule } from '@angular/forms';
import { Court, Facility } from '../../models/facility';

@Component({
  selector: 'app-employed-facility-creation-component',
  imports: [FormsModule],
  templateUrl: './employed-facility-creation-component.html',
  styleUrl: './employed-facility-creation-component.css',
})
export class EmployedFacilityCreationComponent {
  private router = inject(Router)
  private userService = inject(UserService)
  private facilityService = inject(FacilityService)
  
  

  myFacilities: Facility[] = []
  allSports: String[] = []
  index = 1;

  message: String = ""
  error: String = ""
  updateMessage: String = ""
  updateError: String = ""

  selectedFacility: Facility | null = null
  newFacility: Facility = new Facility()
  newCourts: Court[] = []
  newCourt: Court = new Court()

  ngOnInit(){
    this.userService.setPreviousPath("")
    this.userService.getAvailableSports().subscribe(data => this.allSports = data)
    this.userService.getEmployedFacilities(this.userService.getUser().username).subscribe(data => this.myFacilities = data);
  }

  addCourt(){
    let court = new Court()
    court.name = "Teren/Hala " + this.index;
    this.index += 1
    this.newFacility.courts.push(court)
  }

  removeCourt(index: number){
    this.newFacility.courts.splice(index, 1);
  }

  createFacility() {
    this.error = "";
    this.message = "";

    if(!this.newFacility.name || !this.newFacility.city || !this.newFacility.address){
      this.error = "Popunite naziv, grad i adresu!";
      return;
    }

    if(!this.newFacility.pricePerHour || this.newFacility.pricePerHour.valueOf() <= 0){
      this.error = "Unesite validnu cenu po satu!";
      return;
    }

    if(this.newFacility.sports.length == 0){
      this.error = "Izaberite bar jedan sport!";
      return;
    }

    if(this.newFacility.courts.length == 0){
      this.error = "Dodajte bar jedan teren/halu!";
      return;
    }

    let hasOpenCourt = false;

    this.newFacility.courts.forEach(court => {
      if(court.type == "otvoreni_teren" && court.capacity >= 4){
        hasOpenCourt = true;
      }
    })

    if(!hasOpenCourt){
      this.error = "Mora postojati bar jedan otvoreni teren sa kapacitetom N≥4!";
      return;
    }

    const courtNames = this.newFacility.courts.map(c => c.name);
    if(new Set(courtNames).size != courtNames.length){
      this.error = "Nazivi terena/hala moraju biti jedinstveni!";
      return;
    }

    for(let court of this.newFacility.courts){
      if(court.equipmentDescription && court.equipmentDescription.length > 300){
        this.error = `Opis opreme za "${court.name}" prelazi 300 karaktera!`;
        return;
      }
    }

    for (let court of this.newFacility.courts) {
      if(!court.name || court.name.trim() == ""){
        this.error = "Svaki teren/hala mora imati naziv!";
        return;
      }
      if(!court.type){
        this.error = `Izaberite tip za "${court.name}"!`;
        return;
      }
      if(!court.capacity || court.capacity <= 0){
        this.error = `Unesite validan kapacitet za "${court.name}"!`;
        return;
      }
      if(!court.sport || court.sport.trim() == ""){
        this.error = `Unesite sport za "${court.name}"!`;
        return;
      }
      if(!this.newFacility.sports.includes(court.sport)){
        this.error = `Izabrani sport za "${court.name}" se ne nalazi u listi sportova za novi objekat!`;
        return;
      }
    }

    this.newFacility.status = "pending";
    this.newFacility.employees = [this.userService.getUser().username];

    this.facilityService.createFacility(this.newFacility).subscribe(res => {
      if(res.includes("uspešno")){
        this.message = res;
        this.newFacility = new Facility();
        this.index = 1;
      }
      else{
        this.error = res;
      }
    });
  }

  selectFacility(facility: Facility){
    this.selectedFacility = facility
  }

  clearUpdateSelection(){
    this.selectedFacility = null;
    this.newCourt = new Court()
  }

  addCourtToFacility(){

    if(!this.newCourt.name || this.newCourt.name.trim() == ""){
      this.updateError = "Svaki teren/hala mora imati naziv!";
      return;
    }
    if(!this.newCourt.type){
      this.updateError = `Izaberite tip za "${this.newCourt.name}"!`;
      return;
    }
    if(!this.newCourt.capacity || this.newCourt.capacity <= 0){
      this.updateError = `Unesite validan kapacitet za "${this.newCourt.name}"!`;
      return;
    }
    if(!this.newCourt.sport || this.newCourt.sport.trim() == ""){
      this.updateError = `Unesite sport za "${this.newCourt.name}"!`;
      return;
    }
    if(this.selectedFacility && !this.selectedFacility.sports.includes(this.newCourt.sport)){
      this.updateError = `Izabrani sport za "${this.newCourt.name}" se ne nalazi u listi sportova za novi objekat!`;
      return;
    }

    let nameAlreadyExists = false;

    this.selectedFacility?.courts.forEach(court => {
      if(court.name == this.newCourt.name){
        nameAlreadyExists = true;
      }
    })

    if(nameAlreadyExists){
      this.updateError = `Izabrano ime "${this.newCourt.name}" se već koristi u okviru objekta!`;
      return;
    }

    if(this.selectedFacility){
      this.selectedFacility.courts.push(this.newCourt);

      this.facilityService.updateFacility(this.selectedFacility).subscribe(data => {
        this.updateMessage = data;
        this.selectedFacility = null;
        this.newCourt = new Court()
      })
    }
    else{
      this.updateError = "Nije izabran objekat!"
    }
  }

  triggerFileUpload(){
    const input = document.querySelector('input[type="file"][accept=".json"]') as HTMLInputElement;
    input.click();
  }

  importJSON(event: any){
    const file = event.target.files[0];
    if(!file) return;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try{
          const data = JSON.parse(e.target.result);
          
          data.status = 'pending';
          data.employees = [this.userService.getUser().username];
          data.location = data.location || {type: 'Point', coordinates: [0, 0]};
          data.likes = 0;
          data.dislikes = 0;
          data.images = data.images || [];

          this.facilityService.createFacility(data).subscribe(res => {
            if(res.includes("uspešno")){
              this.message = res;
              this.userService.getEmployedFacilities(this.userService.getUser().username).subscribe(data => {
                this.myFacilities = data;
              });
            }
            else{
              this.error = res;
            }
          });
        }
        catch(err){
          this.error = 'Neispravan JSON fajl!';
        }
      };
      reader.readAsText(file);
  }

  getFacilityStatusText(status: String): String{
    switch(status){
      case 'active': return 'Aktivan';
      case 'pending': return 'Na čekanju';
      case 'rejected': return 'Odbijen';
      default: return status;
    }
  }
}

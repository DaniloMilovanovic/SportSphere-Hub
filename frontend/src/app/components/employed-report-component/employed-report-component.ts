import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FacilityService } from '../../services/facility-service';
import { UserService } from '../../services/user-service';
import { FormsModule } from '@angular/forms';
import { Facility } from '../../models/facility';
import { ShopService } from '../../services/shop-service';

@Component({
  selector: 'app-employed-report-component',
  imports: [FormsModule],
  templateUrl: './employed-report-component.html',
  styleUrl: './employed-report-component.css',
})
export class EmployedReportComponent {
  private router = inject(Router)
  private userService = inject(UserService)
  private facilityService = inject(FacilityService)
  private shopService = inject(ShopService)

  selectedMonth: String = ""
  message: String = ""
  errorMessage: String = ""
  myFacilities: Facility[] = [];
  selectedFacility: Facility = new Facility()

  ngOnInit(){
    this.userService.setPreviousPath("")
    this.userService.getEmployedFacilities(this.userService.getUser().username).subscribe(data => this.myFacilities = data)
  }

  selectFacility(facility: Facility){
    this.selectedFacility = facility;
  }

  generateFieldReport(){
    if (!this.selectedFacility?.name) {
        this.errorMessage = "Izaberite objekat!";
        return;
    }
    
    if(!this.selectedMonth){
      this.errorMessage = "Izaberite mesec!";
      return;
    }

    const [year, month] = this.selectedMonth.split("-");
    
    this.facilityService.getOccupancyReport(this.selectedFacility.name, parseInt(year), parseInt(month))
      .subscribe((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `popunjenost_${month}_${year}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.message = "Izveštaj preuzet!";
        this.errorMessage = "";
      });
  }

  generateEquipmentSalesReport(){
    if(!this.selectedMonth){
      this.errorMessage = "Izaberite mesec!";
      return;
    }
    const [year, month] = this.selectedMonth.split("-");
    

    this.shopService.getEquipmentSalesReport(this.userService.getUser().username, parseInt(year), parseInt(month))
      .subscribe((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `promet_opreme_${month}_${year}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.message = "Izveštaj preuzet!";
        this.errorMessage = "";
      });
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

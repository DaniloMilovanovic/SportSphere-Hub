import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { User } from '../../models/user';
import { Reservation } from '../../models/reservation';
import { ReservationService } from '../../services/reservation-service';
import { DatePipe } from '@angular/common';
import { TrainingSession } from '../../models/TrainingSession';
import { Order } from '../../models/order';
import { ShopService } from '../../services/shop-service';

@Component({
  selector: 'app-athlete-profile-overview-component',
  imports: [FormsModule, DatePipe],
  templateUrl: './athlete-profile-overview-component.html',
  styleUrl: './athlete-profile-overview-component.css',
})
export class AthleteProfileOverviewComponent {
  private router = inject(Router)
  private userService = inject(UserService)
  private reservationService = inject(ReservationService)
  private shopService = inject(ShopService)

  user: User = new User()
  editUser: User = new User()
  changingProfile: Boolean = false
   
  selectedFile: File | null = null;
  imagePreview: String = "";
  editImagePreview: String = "";
  generatedAvatar: String = "";
  selectedSports: String[] = [];

  availableSports: String[] = [];
  message: String = ""

  
  sortColumn: String = "";
  sortDirection: String = "asc";
  
  userReservations: Reservation[] = []
  trainingSessions: TrainingSession[] = []

  activeOrders: Order[] = []
  oldOrders: Order[] = []

  ngOnInit(){
    this.userService.setPreviousPath("")
    
    this.user = this.userService.getUser()
    this.selectedSports = this.user.favoriteSports
    this.userService.getAvailableSports().subscribe(data => {
      this.availableSports = data
    })
    this.imagePreview = `http://localhost:4000/uploads/profiles/${this.user.profileImage}`;
    this.editImagePreview = `http://localhost:4000/uploads/profiles/${this.user.profileImage}`;
    this.reservationService.getUserReservations(this.user.username).subscribe(data =>{
      this.userReservations = data
    })
    this.reservationService.getUserTrainings(this.user.username).subscribe(data =>{
      this.trainingSessions = data
    })

    this.shopService.getUserOrders(this.user.username).subscribe(data =>{
      data.forEach(order =>{
        if(order.status == "ordered")
          this.activeOrders.push(order);
        else
          this.oldOrders.push(order);
      })
    })
  }
  
  
  generateAvatar(){
    const seed = this.user.username || Math.random().toString(36).substring(7);
    const avatarUrl = `https://api.dicebear.com/9.x/pixel-art/png?seed=${seed}&size=200`;

    fetch(avatarUrl)
      .then(res => {
        if(!res.ok){
          throw new Error(`HTTP message! status: ${res.status}`);
        }
        return res.blob();
      })
      .then(blob => {
        this.selectedFile = new File([blob], "avatar.png", { type: "image/png" });

        this.editImagePreview = URL.createObjectURL(blob);
      })
      .catch(err => console.error("message generating avatar:", err));
  }

  toggleRole(){
    if(this.user.role == "sportista")
      this.user.role = "zaposleni"
    else
      this.user.role = "sportista"
  }

  
  onFileSelected(event: any){
    let file = event.target.files[0];
    if(file) {
      this.selectedFile = file;
      this.generatedAvatar = "";

      this.editImagePreview = URL.createObjectURL(file);
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('username', this.user.username.valueOf());
    formData.append('firstName', this.editUser.firstName.valueOf());
    formData.append('lastName', this.editUser.lastName.valueOf());
    formData.append('email', this.editUser.email.valueOf());
    formData.append('phone', this.editUser.phone.valueOf());
    formData.append('favoriteSports', JSON.stringify(this.editUser.favoriteSports));

    if (this.selectedFile) {
        formData.append('profileImage', this.selectedFile);
    }

    this.userService.updateUserProfile(formData).subscribe(data =>{
      
      this.user = data
      this.userService.setUser(data)
      this.changingProfile = !this.changingProfile
      this.imagePreview = `http://localhost:4000/uploads/profiles/${this.user.profileImage}`;
    }
    );
}

  onReject(){
    this.changingProfile = !this.changingProfile
    this.editImagePreview = this.imagePreview
    this.selectedFile = null
  }

  editProfile(){
    this.changingProfile = !this.changingProfile
    this.editUser = structuredClone(this.user)
  }

  sortReservations(column: string){
    if(this.sortColumn == column){
      this.sortDirection = this.sortDirection == "asc" ? "desc" : "asc";
    }
    else{
      this.sortColumn = column;
      this.sortDirection = "asc";
    }

    this.userReservations.sort((a: any, b: any) => {
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

  cancelReservation(r: Reservation){
    this.reservationService.updateReservationStatus(r, "cancelled").subscribe(data => {
      this.reservationService.getUserReservations(this.user.username).subscribe(data =>{
        this.userReservations = data
      })
    })
  }

  canCancel(r:Reservation){

    if(r.status == "cancelled" || r.status == "no_show"){
      return false;
    }

    const now = new Date();
    const dateObj = new Date(r.date);
    const dateStr = dateObj.toISOString().split('T')[0];
    const resDate = new Date(`${dateStr}T${r.startTime}:00`);
    const hoursUntil = (resDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    return hoursUntil >= 12
  }


  cancelOrder(order: Order){
    this.shopService.updateOrder(order, "cancelled").subscribe(data =>{
      this.shopService.getUserOrders(this.user.username).subscribe(data =>{
        this.activeOrders = []
        this.oldOrders = []
      data.forEach(order =>{
        if(order.status == "ordered")
          this.activeOrders.push(order);
        else
          this.oldOrders.push(order);
      })
    })
    })
  }

  checkSportCondition(sport: String){
    return this.editUser.favoriteSports.length >= 5 && !this.editUser.favoriteSports.includes(sport);
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

  getOrderStatusText(status: String):String{
    switch(status){
      case 'ordered': return 'Naručeno';
      case 'picked_up': return 'Preuzeto';
      case 'cancelled': return 'Otkazano';
      default: return status;
    }
  }

}

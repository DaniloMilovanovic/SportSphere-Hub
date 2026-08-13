import { Component, inject } from '@angular/core';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { ReservationService } from '../../services/reservation-service';
import { ShopService } from '../../services/shop-service';
import { UserService } from '../../services/user-service';
import { FormsModule } from '@angular/forms';
import { Facility } from '../../models/facility';
import { FacilityService } from '../../services/facility-service';

@Component({
  selector: 'app-employed-profile-overview-component',
  imports: [FormsModule],
  templateUrl: './employed-profile-overview-component.html',
  styleUrl: './employed-profile-overview-component.css',
})
export class EmployedProfileOverviewComponent {
  private router = inject(Router)
  private userService = inject(UserService)
  private reservationService = inject(ReservationService)
  private shopService = inject(ShopService)
  private facilityService = inject(FacilityService)

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

  myFacilities: Facility[] = [];

  ngOnInit(){
    this.userService.setPreviousPath("")
    this.user = this.userService.getUser()
    this.userService.getAvailableSports().subscribe(data => {
      this.availableSports = data
    })
    this.imagePreview = `http://localhost:4000/uploads/profiles/${this.user.profileImage}`;
    this.editImagePreview = `http://localhost:4000/uploads/profiles/${this.user.profileImage}`;
    this.facilityService.findUserFacilities(this.user.username).subscribe(data =>{
      this.myFacilities = data
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

  onSubmit(){
    const formData = new FormData();
    formData.append('username', this.user.username.valueOf());
    formData.append('firstName', this.editUser.firstName.valueOf());
    formData.append('lastName', this.editUser.lastName.valueOf());
    formData.append('email', this.editUser.email.valueOf());
    formData.append('phone', this.editUser.phone.valueOf());
    formData.append('favoriteSports', JSON.stringify(this.editUser.favoriteSports));

    if(this.selectedFile){
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

  checkSportCondition(sport: String){
    return this.editUser.favoriteSports.length >= 5 && !this.editUser.favoriteSports.includes(sport);
  }
}

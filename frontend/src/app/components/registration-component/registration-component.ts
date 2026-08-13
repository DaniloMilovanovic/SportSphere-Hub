import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registration-component',
  imports: [FormsModule, RouterLink],
  templateUrl: './registration-component.html',
  styleUrl: './registration-component.css',
})
export class RegistrationComponent {
  private router = inject(Router)
  private userService = inject(UserService)

  username: String = ""
  password: String = ""
  firstName: String = ""
  lastName: String = ""
  mail: String = ""
  phoneNumber: String = ""
  role: String = "sportista"
  
  selectedFile: File | null = null;
  imagePreview: String = "";
  generatedAvatar: String = "";

  availableSports: String[] = []
  selectedSports: String[] = []

  message: String = "";
  error: String = "";

  registrationNumber: String = "";
  facilityAddress: String = "";
  facilityName: String = "";
  pib: String = "";


  ngOnInit(){
    this.userService.getAvailableSports().subscribe(data => {
      this.availableSports = data
    })
    
    this.userService.setPreviousPath("welcome")
  }
  
  onFileSelected(event: any){
    let file = event.target.files[0];
    if(file) {
      this.selectedFile = file;
      this.generatedAvatar = "";

      this.imagePreview = URL.createObjectURL(file);
    }
  }
  
  generateAvatar(){
    const seed = this.username + Math.random().toString(36).substring(7);
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

        this.imagePreview = URL.createObjectURL(blob);
      })
      .catch(err => console.error("message generating avatar:", err));
  }

  toggleRole(){
    if(this.role == "sportista")
      this.role = "zaposleni"
    else
      this.role = "sportista"
  }

  validatePassword(password: String): Boolean{
    const regex = /^[A-Za-z][A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{7,11}$/;
    const hasUpper = /[A-Z]/.test(password.valueOf());
    const hasNumber = /[0-9]/.test(password.valueOf());
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password.valueOf());

    return regex.test(password.valueOf()) && hasUpper && hasNumber && hasSpecial;
  }

  validatePIB(pib: String): Boolean{
    return /^[1-9][0-9]{8}$/.test(pib.valueOf());
  }

  validateRegistrationNumber(regNum: String): Boolean{
    return /^[0-9]{8}$/.test(regNum.valueOf());
  }
  
  onSubmit(){
    this.message = '';
    this.error = '';
    if(!this.validatePassword(this.password)){
      this.error = 'Lozinka mora imati 8-12 karaktera, početi slovom, i sadržati bar jedno veliko slovo, jedan broj i jedan specijalni karakter.';
      return;
    }
    
    if(this.username == ""){
      this.error = "Morate uneti korisničko ime!"
      return
    }

    if(this.password == ""){
      this.error = "Morate uneti lozinku!"
      return
    }

    if(this.firstName == ""){
      this.error = "Morate uneti Vaše ime!"
      return
    }

    if(this.lastName == ""){
      this.error = "Morate uneti Vaše prezime!"
      return
    }

    if(this.mail == ""){
      this.error = "Morate uneti Vaš mejl nalog!"
      return
    }

    if(this.phoneNumber == ""){
      this.error = "Morate uneti Vaš broj telefona!"
      return
    }

    if(this.selectedSports.length > 5){
      this.error = "Morati izabrati 5 ili manje sportova!"
      return
    }

    if(this.role === 'zaposleni'){
      if(!this.facilityName || !this.facilityAddress){
        this.error = 'Unesite naziv i adresu objekta.';
        return;
      }

      if(!this.validateRegistrationNumber(this.registrationNumber)){
        this.error = 'Matični broj mora imati tačno 8 cifara.';
        return;
      }

      if(!this.validatePIB(this.pib)){
        this.error = 'PIB mora imati tačno 9 cifara i ne sme počinjati nulom.';
        return;
      }
    }

    const formData = new FormData();
    
    formData.append("username", this.username.valueOf());
    formData.append("password", this.password.valueOf());
    formData.append("firstName", this.firstName.valueOf());
    formData.append("lastName", this.lastName.valueOf());
    formData.append("email", this.mail.valueOf());
    formData.append("phone", this.phoneNumber.valueOf());
    formData.append("role", this.role.valueOf());
    formData.append("favoriteSports", JSON.stringify(this.selectedSports));
    
    if(this.role === "zaposleni"){
      formData.append("facilityName", this.facilityName.valueOf());
      formData.append("facilityAddress", this.facilityAddress.valueOf());
      formData.append("registrationNumber", this.registrationNumber.valueOf());
      formData.append("pib", this.pib.valueOf());
    }
    
    if(this.selectedFile){
      formData.append("profileImage", this.selectedFile);
    }

    this.userService.registerUser(formData).subscribe(data =>
      this.message = data
    )
  }

  checkSportCondition(sport: String){
    return this.selectedSports.length >= 5 && !this.selectedSports.includes(sport);
  }

}

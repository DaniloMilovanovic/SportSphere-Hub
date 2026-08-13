import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password-component',
  imports: [FormsModule, RouterLink],
  templateUrl: './reset-password-component.html',
  styleUrl: './reset-password-component.css',
})
export class ResetPasswordComponent {
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private userService = inject(UserService)

  token: String = ""
  newPassword: String = ""
  message:String = ""
  error: String = ""

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get("token") || "";
  }

  resetPassword(){
    
    if (!this.validatePassword(this.newPassword)) {
      this.error = 'Lozinka mora imati 8-12 karaktera, početi slovom, i sadržati bar jedno veliko slovo, jedan broj i jedan specijalni karakter.';
      return;
    }
    this.userService.resetPassword(this.token, this.newPassword).subscribe(data =>{
      alert(data)
      this.router.navigate(["welcome"])
    })
  }

  
  validatePassword(password: String): Boolean{
    const regex = /^[A-Za-z][A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{7,11}$/;
    const hasUpper = /[A-Z]/.test(password.valueOf());
    const hasNumber = /[0-9]/.test(password.valueOf());
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password.valueOf());

    return regex.test(password.valueOf()) && hasUpper && hasNumber && hasSpecial;
  }
}

import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-forgotten-password-component',
  imports: [FormsModule],
  templateUrl: './forgotten-password-component.html',
  styleUrl: './forgotten-password-component.css',
})
export class ForgottenPasswordComponent {
  
  private router = inject(Router)
  private userService = inject(UserService)

  credential: String = ""

  message: String = ""

  ngOnInit(){
    this.userService.setPreviousPath("welcome")
  }

  requestPasswordReset(){
    if(this.credential != "admin"){
      this.userService.requestPasswordReset(this.credential).subscribe(data => {
        this.message = data
      })
    }
    else{
      this.message = "Ne možete menjati šifru za dati nalog!"
    }
  }
}

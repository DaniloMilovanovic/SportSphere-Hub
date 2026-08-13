import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-login-component',
  imports: [FormsModule],
  templateUrl: './admin-login-component.html',
  styleUrl: './admin-login-component.css',
})
export class AdminLoginComponent {

  private router = inject(Router)
  private userService = inject(UserService)

  username: String = ""
  password: String = ""

  message: String = ""

  ngOnInit(){
    this.userService.setPreviousPath("")
  }

  logIn(){
    this.userService.logIntoSystem(this.username, this.password).subscribe(data =>{
      if(data && data.role == "administrator"){
        this.userService.setUser(data)
        this.router.navigate(["admin"]);
      }
      else{
        this.message = "Netačni kredencijali!"
      }
    })
    
  }
}

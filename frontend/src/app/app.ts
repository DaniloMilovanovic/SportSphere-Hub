import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from './services/user-service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title="New app"
  userService = inject(UserService)
  private router = inject(Router)

  logOut(){
    this.userService.removeUser()
    this.router.navigate([""])
  }

  back(){
    let tmpPath = this.userService.getPreviousPath()
    this.userService.setPreviousPath("")
    this.router.navigate([tmpPath])
  }

  checkLoggedIn(){
    return this.userService.getUser() != null
  }
  
  emloyedLoggedIn(){
    return this.userService.getUser().role == "zaposleni"
  }

  athleteLoggedIn(){
    return this.userService.getUser().role == "sportista"
  }

  visitWebPage(path: string) {
    this.router.navigate([path])
  }

  getUserInitials(): string{
    const user = this.userService.getUser();
    if(user.firstName && user.lastName){
      return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
    }
    return user.username?.charAt(0)?.toUpperCase() || 'U';
  }
}

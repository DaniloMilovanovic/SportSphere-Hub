import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { UserService } from './services/user-service';
import { User } from './models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private userService = inject(UserService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const user: User = this.userService.getUser();
    const allowedRoles = route.data['roles'] as string[];

    if(!user){
      this.router.navigate(['/welcome']);
      return false;
    }

    if(allowedRoles && !allowedRoles.includes(user.role.valueOf())){
      this.router.navigate(['/welcome']);
      return false;
    }

    return true;
  }
}
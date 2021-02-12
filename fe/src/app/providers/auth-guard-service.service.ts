import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardServiceService {

  constructor(public auth: AuthService, public router: Router, public toastService: ToastService) { }

  canActivate(): boolean {

    console.log("Heya");
    

    if (!this.auth.isUserAuthenticated()) {
      this.toastService.warning('Sign in', 'Please sign in to access this page')
      this.router.navigate(['home']);
      return false
    }
    return true

  }

}

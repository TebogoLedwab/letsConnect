import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuardService {

  constructor(public auth: AuthService, public router: Router, public toastService: ToastService) { }
  
  canActivate(): boolean {
    if (!this.auth.isAdminAuthenticated()) {
      this.toastService.warning('Sing in', 'Please sign in as Admin to access this page')
      this.router.navigate(['home']);
      return false;
    }
    return true;
  }

}

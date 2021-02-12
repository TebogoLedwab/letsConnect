import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/providers/auth.service';
import { User } from 'src/app/models/data-type';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastService } from 'src/app/providers/toast.service';

@Component({
  selector: 'Navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  //current_user_initial = (current_user.name.charAt(0)).toUpperCase();
  current_user_initial: string = null;

  current_user;

  constructor(private router: Router, public authService: AuthService, private sanitizer: DomSanitizer, private toast: ToastService) { }

  ngOnInit(): void {

    this.get_current_user_initial();

  }

  sanitizeUserAvatar(base64String) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/jpg;base64,${base64String}`);
  }


  get_current_user_initial() {
    if (localStorage.getItem('current_user')) {
      this.current_user_initial = (JSON.parse(localStorage.getItem('current_user')).name.charAt(0)).toUpperCase();
    }
  }


  // no stress, u can remove the timeout then signout, it will still work
  // or call it straight from the front-end with: this.authService.signout();
  signout() {
    setTimeout(() => {
      this.authService.signout();
    }, 100);
  }


  goto_my_profile() {
    // requires my id
    // then go to profile by passing
    console.log('go to profile/user_id');
  }



}

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/providers/toast.service';

@Component({
  selector: 'Signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  @Output('switch_component')
  switch_component: EventEmitter<string> = new EventEmitter<string>();

  in_email: string = "";
  in_password: string = "";

  constructor(private auth: AuthService, private router: Router, private toast: ToastService) { }

  ngOnInit(): void {

  }

  // emit component name to show to the parent
  switch_component_to = (component: string) => this.switch_component.emit(component);

  // sign in
  sign_in() {

    //call auth service singin method
    this.auth.sign_in(this.in_email, this.in_password).subscribe(
      (data) => {

        this.auth.setAccessToken(data.token);// set token to localstorage via auth service

        // get user by token
        this.auth.getUserPerToken().subscribe((res) => {

          this.auth.setCurrentUser(res);// on success, store user in auth

          this.toast.success('Sign in success', `Welcome ${res.name.toUpperCase()}`);

          this.in_email = '';
          this.in_password = '';

          this.router.navigate(['dash']);// redirect to dashboard

        }, error => { /* this.toast.danger('Error', error.error.errors[0].msg); */ });

      },
      (error) => {
        if (error) {
          this.toast.danger('Error', error.error.errors[0].msg);
        }
      }
    );

  }

}

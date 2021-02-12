import { Component, OnInit, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/providers/toast.service';

@Component({
  selector: 'Adminsignin',
  templateUrl: './adminsignin.component.html',
  styleUrls: ['./adminsignin.component.scss']
})
export class AdminsigninComponent implements OnInit {

  switch_component: EventEmitter<string> = new EventEmitter<string>();

  in_email: string = "";
  in_password: string = "";

  constructor(private auth: AuthService, private router: Router, private toast: ToastService) { }

  ngOnInit(): void {
  }

  // sign in
  sign_in() {

    //call auth service singin method
    this.auth.admin_sign_in(this.in_email, this.in_password).subscribe(
      (data) => {

        // return only a token
        localStorage.setItem('admin_token', data.token);

        // on success, store user in a value
        this.auth.current_user = {};
        this.auth.setCurrentAdmin(data.admin);

        this.toast.success('Sign in success', `Welcome ${data.admin.name.toUpperCase()}`);

        this.router.navigate(['/admindash']);

        this.in_email = '';
        this.in_password = '';

      },
      (error) => {
        if (error) {
          this.toast.danger('Error', error.error.errors[0].msg);
        }
      }
    );

  }

  // emit component name to show to the parent
  switch_component_to = (component: string) => this.switch_component.emit(component);

}

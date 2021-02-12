import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/models/data-type';
import { AuthService } from 'src/app/providers/auth.service';
import { ToastService } from 'src/app/providers/toast.service';

@Component({
  selector: 'Signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  @Output('switch_component')
  switch_component: EventEmitter<string> = new EventEmitter<string>();

  up_name: string = "";
  up_email: string = "";
  up_password: string = "";

  constructor(private auth: AuthService, private toast:ToastService) { }

  ngOnInit(): void {
  }

  // emit component name to show to the parent
  switch_component_to = (component: string) => this.switch_component.emit(component);

  // sign_up method
  sign_up() {

    let user = new User();//create instance of user

    //set user values to binded form inputs
    user.name = this.up_name;
    user.email = this.up_email;
    user.password = this.up_password;

    this.auth.sign_up(user).subscribe(
      (data) => {

        this.toast.success('Verify Email', data.msg);
        this.switch_component_to('Signin');//switch to sing_in component
      },
      (error) => {
        if (error) {
          this.toast.danger('Error', error.error.errors[0].msg);
        }
      }
    );

  }

}

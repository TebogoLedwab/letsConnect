import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  // holds authentication (Signin && Signup) components
  component: string = 'Signin'; 

  constructor() { }

  ngOnInit(): void {
  }


  // handle component switch from the child event
  handle_switch_component = event => {this.component = event; console.log(event);
  }


}

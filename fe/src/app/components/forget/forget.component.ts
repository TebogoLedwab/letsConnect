import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'Forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.scss']
})
export class ForgetComponent implements OnInit {

  @Output( 'switch_component' )
  switch_component: EventEmitter<string> = new EventEmitter<string>();

  in_email: string = "";

  constructor() { }

  ngOnInit(): void {
  }


    // emit component name to show to the parent
    switch_component_to = ( component: string ) => this.switch_component.emit( component );
  
    // forget password
  forget_password () {
      
    }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { InternetService } from './providers/internet.service';
import { HttpClient } from '@angular/common/http';
// declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
} )
  
  
export class AppComponent implements OnInit {

  constructor (
    private router: Router,
    private spinner: NgxSpinnerService,
    private internet: InternetService
    ) {
      this.internet.internet_check();
    }
  
  ngOnInit (): void {

    this.spinner.show();
 
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);

  }
}

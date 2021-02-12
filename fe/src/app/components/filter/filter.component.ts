import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'Filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  @Input() searchLabel: string;

  @Output( 'filter_by' )
  filter_by: EventEmitter<string> = new EventEmitter<string>();


  @Output( 'search' )
  search: EventEmitter<string> = new EventEmitter<string>();

  // keep the url path of the parent component
  url_path: string;

  // color for search label
  labelColor:string = "white";

  constructor (private router: Router) { 
    // set the path before the component init
    this.url_path = this.router.url;
  }


  ngOnInit (): void {
    // console.log( window.location.href );
    // console.log( this.url_path );
  }

  changeLabel() {
    this.labelColor = "grey";
  }

  // filter data by
  on_filter_by = ( data: string ) => this.filter_by.emit( data ); 

  
  // get data from front end
  on_search = ( event: any ) => this.search.emit( event );

}

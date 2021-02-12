import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'Banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

  @Input( 'img' ) in_img;
  banner_image;

  @Input( 'header1' ) header1;
  @Input( 'header2' ) header2;
  @Input( 'header3' ) header3;
  @Input( 'header4' ) header4;

  constructor() { }

  ngOnInit (): void {
    // init the side image
    this.banner_image = `../../../assets/images/${this.in_img}`
  }

}

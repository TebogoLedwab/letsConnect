import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StoreService } from 'src/app/providers/store.service';
import { Profile } from 'src/app/models/data-type';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';
import { DomSanitizer } from '@angular/platform-browser';
import { AvatarService } from 'src/app/providers/avatar.service';
declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profile: Profile;
  avatarUrl;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: StoreService,
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private avatarService: AvatarService
  ) { }

  ngOnInit(): void {

    this.spinner.show();
    this.store.GET_PROFILES_STORE().subscribe(profiles => {
      this.profile = _.find(
        profiles,
        // tslint:disable-next-line:triple-equals
        profile => profile._id == this.activatedRoute.snapshot.params.id
      );

      if (this.profile)
        this.avatarUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.avatarService.generateAvatar(this.profile.user.name));


      this.spinner.hide();
      if (!this.profile) {
        console.log("No rpoffkd");
        
        this.navigate_home();// if no profile is found route to home
      }

    });

  }

  sanitizeAvatar(base64String) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/jpg;base64,${base64String}`);
  }



  // navigate back to home page
  // tslint:disable-next-line:variable-name
  navigate_home = () => this.router.navigate(['home']);

}

function titleCase(name: string){

  name.split(" ");

  if(!name)  return name;
  return name[0].toUpperCase() + name.substr(1).toLowerCase();
}

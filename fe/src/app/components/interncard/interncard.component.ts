import { Component, OnInit, Input } from '@angular/core';
import { Profile } from 'src/app/models/data-type';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from 'src/app/providers/profile.service';
import { AvatarService } from 'src/app/providers/avatar.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'Interncard',
  templateUrl: './interncard.component.html',
  styleUrls: ['./interncard.component.scss']
})
export class InterncardComponent implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('profile') profile: Profile;
  
  imagePath;
  avatarUrl;

  constructor(private router: Router, private profileService: ProfileService, private sanitizer: DomSanitizer,
    private http: HttpClient, private avatarService: AvatarService) { }

  ngOnInit(): void {

    this.avatarUrl = this.avatarService.generateAvatar(this.profile.user.name);

    /* Sanitizing the user's avatar */
    if (this.profile) {
      this.sanitize(this.profile.user.avatar);
    }
  }

  /* Cleans and sanitizes the image for display */
  sanitize(base64String) {
    this.imagePath = this.sanitizer.bypassSecurityTrustResourceUrl(
      'data:image/jpg;base64,' + base64String
    );
  }

  // view a single profile
  // tslint:disable-next-line:variable-name
  view_profile = () => this.router.navigate(['profile', this.profile._id]);

}

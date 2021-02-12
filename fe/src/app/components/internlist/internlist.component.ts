import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { ProfileService } from 'src/app/providers/profile.service';
import { Profile } from 'src/app/models/data-type';
import { ToastService } from 'src/app/providers/toast.service';
import { StoreService } from 'src/app/providers/store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-internlist',
  templateUrl: './internlist.component.html',
  styleUrls: ['./internlist.component.scss']
})
export class InternlistComponent implements OnInit {

  allProfiles: Profile[];
  profiles: Profile[];

  constructor(private profileService: ProfileService, private toast: ToastService, private store:StoreService,
    private router:Router) { }

  ngOnInit(): void {
    this.getInterns();
  }

  getInterns() {
    this.profileService.getProfiles().subscribe(
      (data) => {
        this.store.SET_PROFILE_STORE(data);
        this.allProfiles = data;
        this.profiles = this.allProfiles;
      },
      (error) => {
        if (error) {
          this.toast.danger('Error', error.error.errors[0].msg);
        }
      }
    );

  }

  saveUser(profile) {

    this.profileService.updateUserStatus(profile).subscribe(
      (data) => {
        this.toast.success('Success', "User Status Saved");
      },
      (error) => {
        if (error) {
          this.toast.danger('Error', error.error.errors[0].msg);
        }
      }
    )
  }

  onFilter(event) {

    if (event == "All") {
      this.profiles = this.allProfiles;
    } else {
      this.profiles = this.allProfiles.sort((a, b) => b.points - a.points).slice(0, event);
    }

  }


  onSearch(event) {

    if (event == '') {
      this.profiles = this.allProfiles;
    } else {
      var newProfiles = this.allProfiles.filter(function (user) {
        return user.user.name.toLowerCase().includes(event.toLowerCase());
      });

      this.profiles = newProfiles;
    }

  }

  viewProfile(profile){    
    this.router.navigate([`profile/${profile._id}`]);
  }

}

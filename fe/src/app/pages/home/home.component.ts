import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ProfileService } from "src/app/providers/profile.service";
import { Observable } from "rxjs";
import { Profile } from "src/app/models/data-type";
import { StoreService } from "src/app/providers/store.service";
declare var $: any;

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  profiles: Array<Profile>;
  allProfiles: Array<Profile>;


  users: any[];
  allUsers: any[];

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private store: StoreService
  ) { }

  ngOnInit(): void {
    this.getProfiles();
  }

  // get list of all profile
  getProfiles(): void {
    this.profileService.getProfiles().subscribe(profiles => {
      // set profiles in the store
      this.store.SET_PROFILE_STORE(profiles);

      // set profiles
      this.allProfiles = profiles;
      this.profiles = profiles;

    });
  }

  // on handle filter logics
  handle_filter(event): void {
    console.info("Home page Filter by : ", event);
    // switch filter events, then call appropriete function
    switch (event) {
      case "20":
        // get the top 20 dv with higher points
        this.get_top_20();
        this.profiles = this.profiles
          .sort((a, b) => b.points - a.points)
          .slice(0, event);
        break;

      case "10":
        // get the top 10 dv with higher points
        this.get_top_10();
        this.profiles = this.profiles
          .sort((a, b) => b.points - a.points)
          .slice(0, event);
        break;

      case "5":
        // get the top 20 dv with higher points
        this.get_top_5();
        this.profiles = this.profiles
          .sort((a, b) => b.points - a.points)
          .slice(0, event);
        break;

      default:
        // by default we refresh all profiles, reassign new data to the store
        this.getProfiles();
        break;
    }
  }

  // handle search logics
  handle_search(event) {

    if (event == "") {
      // If empty show all
      this.profiles = this.allProfiles;
    } else {
      // Else filter
      var newProfiles = this.allProfiles.filter(function (profile) {
        return profile.user.name.toLowerCase().includes(event.toLowerCase()); // make all to lowercase 'cause it's case sensitive
      });

      this.profiles = newProfiles;
    }
  }

  //********** FILTER FUNCTION SECTION ***************//

  // returns only the top 5 to profiles v ariable
  get_top_5(): void {
    console.log("filter top 5 here, then assign it to profile");
    this.profiles;
    console.log(this.profiles);
  }

  // returns only the top 10 to profiles v ariable
  get_top_10(): void {
    console.log("filter top 10 here, then assign it to profile");
    this.profiles;
  }

  // returns only the top 10 to profiles v ariable
  get_top_20(): void {
    console.log("filter top 20 here, then assign it to profile");
    this.profiles;
  }
}

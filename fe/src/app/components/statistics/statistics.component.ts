import { Component, OnInit } from '@angular/core';
import { ApplicationService } from 'src/app/providers/application.service';
import { ProfileService } from 'src/app/providers/profile.service';
import { BlogService } from 'src/app/providers/blog.service';
import { CommunityService } from 'src/app/providers/community.service';
import { StoreService } from 'src/app/providers/store.service';
import { Profile, Blog, Community } from 'src/app/models/data-type';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  // All fields
  profiles: Profile[];
  applications: any[];
  blogs: Blog[];
  comms: Community[];

  loaded: boolean = false;

  constructor(private applicationService: ApplicationService, private profileService: ProfileService,
    private blogService: BlogService, private communityService: CommunityService, private store: StoreService) { }

  ngOnInit(): void {

    this.expelled_user_count = 0;
    this.left_user_count = 0;
    this.current_user_count = 0;
    this.graduated_user_count = 0;

    this.unemployed_intern_count = 0;
    this.employed_intern_count = 0;
    this.not_sure_intern_count = 0;
    this.no_data_count = 0;

    this.getProfiles();
    this.getApplications();
    this.getBlogs();
    this.getAllComms();

  }

  // Get All Profiles
  getProfiles() {
    // get list of all profile
    this.profileService.getProfiles().subscribe(profiles => {

      this.store.SET_PROFILE_STORE(profiles);// set profiles in the store

      this.profiles = profiles;// set profiles

      this.countUserStats();// calculate user stats once intern is loaded
      this.countInternStats();// calculate intern stats once intern is loaded
    });

  }

  // Get All Applications
  getApplications() {
    this.applicationService.getApplications().subscribe(
      (data) => {
        this.applications = data;// set appications
      }
    )
  }

  // Get All Blog Posts
  getBlogs() {
    this.blogService.getBlogs().subscribe(
      (blogs) => {
        this.blogs = blogs; // set blogs
      }
    )
  }

  // Get All Community Posts
  getAllComms() {
    this.communityService.getAllComms().subscribe(
      data => {

        this.comms = data;// set comms
        this.loaded = true;// set loaded to true
      })
  }

  /* ==================
        Chart 1
  ===================*/

  // User Status count
  expelled_user_count: number = 0;
  left_user_count: number = 0;
  current_user_count: number = 0;
  graduated_user_count: number = 0;

  // Bar Graph (Chart 1) fields
  public chartType: string = 'bar';// Type
  public chartDatasets: Array<any>;// Actual Data Set
  public chartLabels: Array<any>;// Labels for the data

  // Setting Bar Graph (Chart 1)  colors
  public chartColors: Array<any> = [
    {
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)'
      ],
      borderWidth: 2,
    }
  ];

  // Setting Bar Graph (Chart 1)  options
  public chartOptions: any = {
    responsive: true
  };
  public chartClicked(e: any): void { this.ngOnInit() }
  public chartHovered(e: any): void { }

  // Calculate all User stats
  countUserStats() {

    this.profiles.forEach(profile => {

      switch (profile.status) {
        case 'Removed':
          this.expelled_user_count++;
          break;

        case 'Resigned':
          this.left_user_count++;
          break;

        case 'Intern':
          this.current_user_count++;
          break;

        case 'Graduated':
          this.graduated_user_count++;
          break;

        default:
          break;
      }

    });
    
    // Setting the Data Sets
    this.chartDatasets = [
      {
        data: [this.current_user_count,this.graduated_user_count, this.expelled_user_count, this.left_user_count
          , this.getHighest()], label: `Of All (${this.profiles.length}) Users`
      }
    ];

    // Setting the Data Labels
    this.chartLabels = ['Current Interns', 'Graduated', 'Removed', 'Resigned'];

  }

  // Get Highest value from intern count
  getHighest(): number {

    var countsArr = [this.expelled_user_count, this.left_user_count,
    this.current_user_count, this.graduated_user_count];// Place different counts in array

    //getting highest value of the counts array
    var max = countsArr.reduce(function (a, b) {
      return Math.max(a, b);
    });

    return max + 1;// return max + 1 to be set on graph

  }

  /* ==================
        Chart 2
  ===================*/

  // Intern Employement count
  unemployed_intern_count: number = 0;
  employed_intern_count: number = 0;
  not_sure_intern_count: number = 0;
  no_data_count: number = 0;

  // Pie Chart (Chart 2) fields
  public chart2Type: string = 'pie';
  public chart2Datasets: Array<any>;
  public chart2Labels: Array<any>;

  // Setting Pie Chart (Chart 2) colors
  public chart2Colors: Array<any> = [
    {
      backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
      hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5', '#616774'],
      borderWidth: 2,
    }
  ];

  // Setting Pie Chart (Chart 2) options
  public chart2Options: any = {
    responsive: true
  };
  public chart2Clicked(e: any): void { this.ngOnInit() }
  public chart2Hovered(e: any): void { }

  // Calculate all User stats
  countInternStats() {

    this.profiles.forEach(profile => {

      // calculate difference in ms between last update and current date
      var lastUpdateDifference = new Date().getTime() - new Date(profile.user.date).getTime();

      // convert ms to days
      var diffDays = Math.floor(lastUpdateDifference / (1000 * 60 * 60 * 24));

      console.log(diffDays);


      //If intern profile doesn't have experience then increment unemployed
      if (profile.experience.length == 0)
        this.no_data_count++;


      //If intern profile hasn't been updated in a while then increment not sure
      if (diffDays > 7)
        this.not_sure_intern_count++;

      else {
        profile.experience.forEach(exp => {

          if (exp.current)
            this.employed_intern_count++;

          else
            this.unemployed_intern_count++;


        });
      }

    });

    // Setting the Data Sets
    this.chart2Datasets = [
      {
        data: [this.unemployed_intern_count, this.employed_intern_count, this.not_sure_intern_count,
        this.no_data_count], label: 'All Da Interns'
      }
    ];

    // Setting the Data Labels
    this.chart2Labels = ['Unemployed', 'Employed', 'Not Sure', 'No Data'];

  }

}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastService } from 'src/app/providers/toast.service';
import { ProfileService } from 'src/app/providers/profile.service';
import { Experience } from 'src/app/models/data-type';

@Component({
  selector: 'app-workexperience',
  templateUrl: './workexperience.component.html',
  styleUrls: ['./workexperience.component.scss']
})
export class WorkexperienceComponent implements OnInit {

  @Input() experience: Experience[];
  @Output() outAddExperience = new EventEmitter();
  @Output() outDelExperience = new EventEmitter();

  ShowForm: boolean = false;

  currentJob: boolean = false;
  jobTittle: string = "";
  companyName: string = "";
  location: string = "";
  from: string = "";
  to: string = "";
  description: string = "";

  constructor(private toast: ToastService, private profileService: ProfileService) { }

  ngOnInit() {

  }

  emitExperience() {

    if ((this.jobTittle == '' || this.companyName == '' || this.from == '' || this.description == '') || (this.currentJob == false && this.to == "")) {
      this.toast.danger('Error', "Enter All Fields");
    } else {

      let newExperience = {
        title: this.jobTittle,
        company: this.companyName,
        location: this.location,
        from: this.from,
        to: this.to,
        current: this.currentJob,
        description: this.description
      }

      this.profileService.addExperience(newExperience).subscribe(
        (data) => {
          this.experience = data
          this.toast.success("Success", "Added Work Experience")

          this.ShowForm = false;
          this.currentJob = false;
          this.jobTittle = "";
          this.companyName = "";
          this.location = "";
          this.from = "";
          this.to = "";
          this.description = "";

        },
        (error) => {
          console.log(error);

        }
      );

    }
  }

  deleteExperience(exp) {

    this.profileService.deleteExperience(exp._id).subscribe(
      (data) => {
        this.experience = data;
      },
      (error) => {
        console.log(error);
      }
    )
  }

}

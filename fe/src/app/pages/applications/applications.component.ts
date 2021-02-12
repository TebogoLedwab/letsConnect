import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastService } from 'src/app/providers/toast.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApplicationService } from 'src/app/providers/application.service';
import { Cohort } from 'src/app/models/data-type';
import { CohortService } from 'src/app/providers/cohort.service';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {

  @ViewChild('comfirmStatusChangeModal', { static: true }) comfirmStatusChangeModal: ModalDirective;
  @ViewChild('confirmDeleteModal', { static: true }) confirmDeleteModal: ModalDirective;


  applications: any[];
  cohorts: Cohort[];


  statusChange: any;
  currentApplication: any;
  confirmStatusChange: boolean = false;
  confirmDelete: boolean = false;

  addCohort: boolean = false;

  newCohort: Cohort = new Cohort();

  constructor(private applicationService: ApplicationService, private cohortService: CohortService, private toast: ToastService,
    private sanitizer: DomSanitizer, private router: Router) { }

  ngOnInit() {
    this.getApplications();
    this.getCohorts();
  }

  /* =================
      Applications
  ====================*/

  getApplications() {
    this.applicationService.getApplications().subscribe(
      (data) => {
        console.log(data);

        this.applications = data;
      },
      (error) => {
        console.log(error);

        if (error) {
          this.toast.danger('Error', error.error.errors[0].msg);
        }
      }
    )
  }

  comfirmStatusChange(application, event) {

    this.confirmStatusChange = true;
    this.statusChange = event.target.value;
    this.currentApplication = application;

    this.comfirmStatusChangeModal.show();

  }

  // confirmApplicationDelete(application) {

  //   this.confirmDelete = true;
  //   this.currentApplication = application;

  //   this.confirmDeleteModal.show();

  // }

  updateStatus() {

    this.currentApplication.status = this.statusChange;

    this.applicationService.updateAppplication(this.currentApplication).subscribe(
      (data) => {
        this.toast.success("Success", `Successfuly updated aplication status to ${data.apply.status}`);
        this.comfirmStatusChangeModal.hide();
      },
      (error) => {
        if (error) {
          this.toast.danger('Error', error.error.errors[0].msg);
        }
      }
    )
  }

  // deleteApplication() {

  //   this.applicationService.deleteAppplication(this.currentApplication._id).subscribe(
  //     (data) => {

  //       console.log(this.currentApplication);
  //       console.log(this.applications);


  //       this.toast.success("Success", `Successfuly deleted aplication`);
  //       this.confirmDeleteModal.hide();

  //       this.ngOnInit()

  //     },
  //     (error) => {
  //       if (error) {
  //         this.toast.danger('Error', error.error.errors[0].msg);
  //       }
  //     }
  //   )

  // }

  /**************************
         Image Methods
 ***************************/

  /* Cleans and sanitizes the image for display */
  sanitize(base64String) {
    return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
      + base64String);
  }

  /* =================
        Cohorst
  ====================*/

  getCohorts() {
    this.cohortService.getCohorts().subscribe(
      (data) => {
        console.log(data);
        this.cohorts = data;
      },
      (error) => {
        if (error) {
          this.toast.danger('Error', error.error.errors[0].msg);
        }
      }
    )
  }

  getProgress(cohort: Cohort) {
    // Convert to unix values timestamp values
    /* var startDate = new Date(cohort.startDate).getTime();
    var endDate = new Date(cohort.endDate).getTime();
    var todayDate = new Date().getTime(); */

    // Get the total possible timestamp value
    /* var total = endDate - startDate; */

    // Get the current value
    /* var current = todayDate - startDate; */

    // Get the percentage
    /* var percentage = Math.round((current / total) * 100);

    return (percentage); */

    var start = new Date(cohort.startDate).getTime(),
      end = new Date(cohort.endDate).getTime(),
      today = new Date().getTime();

    let p = Math.round(((today - start) / (end - start)) * 100) + '%';

    // Update the progress bar
    return p;
  }

  saveCohort() {

    if (!this.newCohort.name || !this.newCohort.startDate || !this.newCohort.endDate || !this.newCohort.notes || !this.newCohort.internNumber)
      this.toast.danger("Input Error", "Please fill in all fields")

    else {

      this.cohortService.addCohort(this.newCohort).subscribe(
        (data) => {
          this.ngOnInit()
        },
        (error) => {
          if (error) {
            this.toast.danger('Error', error.error.errors[0].msg);
          }
        }
      )

    }

  }

  deleteCohort(cohort) {

    this.cohortService.deleteCohort(cohort._id).subscribe(
      (data) => {

        this.ngOnInit()

      },
      (error) => {
        if (error) {
          this.toast.danger('Error', error.error.errors[0].msg);
        }
      }
    )

  }

}

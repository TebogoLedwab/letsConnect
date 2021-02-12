import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastService } from 'src/app/providers/toast.service';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/providers/profile.service';
import { AuthService } from 'src/app/providers/auth.service';
import { User } from 'src/app/models/data-type';
declare var jQuery: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  currentUser;
  user: User;

  newSkill = {
    skill: '',
    scale: 1,
  }

  newInterest: string = '';

  newSkillEmpty: boolean = false;
  addSkill: boolean = false;
  addInterest: boolean = false;

  constructor(private profileService: ProfileService, private authService: AuthService, private toast: ToastService, private router: Router,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.profileService.getCurrentUserProfile().subscribe(
      (data) => {
        this.currentUser = data;
        console.log(this.currentUser);

      }
    );
  }


  /* Save User to database */
  saveUser(user) {

    this.profileService.updateUser({

      name: user.user.name,
      email: user.user.email,
      password: user.user.password,
      avatar: user.user.avatar,
      backgroundImage: user.user.backgroundImage,
      gender: user.user.gender,
      age: user.user.age,
      mobile_number: user.user.mobile_number,
      oldPass: user.oldPass,
      newPass: user.newPass

    }).subscribe(
      (data) => {


        this.profileService.updateUserProfile(user).subscribe(
          (data) => {

            console.log(data);

            this.authService.current_user = data.user;

            this.toast.success('Success', "Profile Updated Succefully");

            this.ngOnInit();
          },
          (error) => {
            if (error) {
              this.toast.danger('Error', error.error.errors[0].msg);
            }
          }
        )

        this.currentUser.user = data;

        this.toast.success('Success', "Details Updated Succefully");

      },
      (error) => {
        if (error) {
          console.log();
          this.toast.danger('Error', error.error.msg);
        }

      })

  }

  //Save Skill
  saveSkill() {

    /* Check if newSkill field is empty */
    if (this.newSkill.skill == '') {
      this.toast.danger("Input Error", "Please Enter a skill");
    } else {

      this.newSkillEmpty = false;
      this.currentUser.skills.push(this.newSkill);
      this.saveUser(this.currentUser)

    }

  }

  //Save Skill
  saveInterest() {

    /* Check if newSkill field is empty */
    if (this.newInterest == '') {
      this.toast.danger("Input Error", "Please Enter an interest");
    } else {

      this.newSkillEmpty = false;
      this.currentUser.interests.push(this.newInterest);
      this.saveUser(this.currentUser)

    }

  }

  // Delete Skill
  deleteSkill(skill) {

    let newSkills = this.currentUser.skills.filter(e => e !== skill)

    this.currentUser.skills = newSkills;
    this.saveUser(this.currentUser);

  }

  // Delete Interest
  deleteInterest(interest) {

    let newInterests = this.currentUser.interests.filter(e => e !== interest)

    this.currentUser.interests = newInterests;
    this.saveUser(this.currentUser);

  }

  sanitizeAvatar(base64String) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/jpg;base64,${base64String}`);
  }

  // Save Document
  saveImage(event) {
    if (event) {
      this.currentUser.cv = event;
      this.saveUser(this.currentUser);
    }
  }

  /* Delete Document */
  deleteDocument() {
    this.currentUser.cv = "";
    this.saveUser(this.currentUser);
  }

  /* */
  deleteNotification(notification) {

    this.profileService.deleteNotification(notification._id).subscribe(
      (data) => {
        this.currentUser = data;
      },
      (error) => {
        if (error) {
          this.toast.danger('Error', error.error.errors[0].msg);
        }
      }
    )

  }

  clearNotifications(){
    this.currentUser.notifications = [];
    this.saveUser(this.currentUser);
  }

  change(event) {
    this.newSkill.scale = event.newValue;
  }

  // Apply Method 
  // apply() {
  //   this.profileService.apply().subscribe(data => {
  //     this.toast.success("Applied",
  //       "Your application has been submitted. You will be contacted if you're succesfull");
  //   },
  //     (error) => {
  //       if (error) {
  //         this.toast.danger('Error', error.error.errors[0].msg);
  //       }
  //     });

  // }

}

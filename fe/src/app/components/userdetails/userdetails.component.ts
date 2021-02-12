import { Component, OnInit, EventEmitter, ViewChild, Input, Output } from '@angular/core';
import { ToastService } from 'src/app/providers/toast.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalDirective } from 'angular-bootstrap-md';
import { User, Profile } from 'src/app/models/data-type';
import { AvatarService } from 'src/app/providers/avatar.service';

@Component({
  selector: 'app-userdetails',
  templateUrl: './userdetails.component.html',
  styleUrls: ['./userdetails.component.scss']
})
export class UserdetailsComponent implements OnInit {
  /* Modals */
  @ViewChild("detailsModal", { static: true }) detailsModal: ModalDirective;

  @Input() profile: Profile;
  @Output() outUser = new EventEmitter();

  currentUser: Profile;

  imageToUploadBase64: string;
  avatarUrl;

  editPassword = false;
  newPass = "";
  oldPass = "";
  confPass = "";

  constructor(private toast: ToastService, private sanitizer: DomSanitizer, private avatarService:AvatarService) { }


  

  ngOnInit() {

    this.currentUser = JSON.parse(JSON.stringify(this.profile));// cloning profile into currentUser

    if (this.currentUser && this.currentUser.user.avatar) {
      this.sanitize(this.currentUser.user.avatar);
    }

    this.avatarUrl = this.avatarService.generateAvatar(this.profile.user.name);

   
    
  }

 

  showModal() {
    this.detailsModal.show();
  }

  hideModal() {
    this.detailsModal.hide();
  }

  emitUser() {

    if (this.imageToUploadBase64) {
      this.currentUser.user.avatar = this.imageToUploadBase64;
    }

    if ((this.editPassword && (this.confPass == "" || this.newPass == ""
      || this.oldPass == "")) || (this.editPassword && this.passwordsDontMatch())) {

      this.toast.danger("Invalid Fields", "Please fill in form properly");

    } else {

      this.outUser.emit(this.currentUser);
      this.hideModal();

    }
  }

  saveImage(event) {
    if (event) {
      this.imageToUploadBase64 = event;
      this.emitUser()
    }
  }

  passwordsDontMatch() {
    return !(this.confPass == this.newPass);
  }

  /* Cleans and sanitises the image for display */
  sanitize(base64String) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      "data:image/jpg;base64," + base64String
    );
  }
  
 
  

}

function titleCase(name: string){

  name.split(" ");

  if(!name)  return name;
  return name[0].toUpperCase() + name.substr(1).toLowerCase();
}



 // transform(){
  //   this.profile.user.name = this.titleCasePipe.transform(this.profile.user.name);
  // }
  
// function capital_letter(name) 
// {
//   name = name.split(" ");

//     for (let i = 0, x = name.length; i < x; i++) {
//       name[i] = name[i][0].toUpperCase() + name[i].substr(1);
//     }

//     return name.join(" ");
    
// }

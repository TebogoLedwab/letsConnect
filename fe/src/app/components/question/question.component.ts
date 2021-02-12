import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy } from "@angular/core";
import { AuthService } from "src/app/providers/auth.service";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { CommunityService } from "src/app/providers/community.service";
import { ToastService } from "src/app/providers/toast.service";
import { DomSanitizer } from "@angular/platform-browser";
import { AvatarService } from 'src/app/providers/avatar.service';

@Component({
  selector: "Question",
  templateUrl: "./question.component.html",
  styleUrls: ["./question.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class QuestionComponent implements OnInit {
  @Input() comm: any;
  currentUser: any;
  commentText: string;
  tags: String[];
  color = "teal";

  avatarBase64: string;
  imageToUploadBase64: string;
  commImage;
  imagePathToUpload;
  isFileSelected = false;
  imagePath;
  avatarUrl;
  comments: boolean = false;


  userId: any;

  constructor(private auth: AuthService, private httpClient: HttpClient, private communityService: CommunityService,
    private toast: ToastService, private router: Router, private sanitizer: DomSanitizer,
    private avatarService: AvatarService, private cdRef: ChangeDetectorRef) { }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    if (this.auth.isUserLoggedIn()) {

      this.currentUser = JSON.parse(localStorage.getItem('current_user'));
      this.userId = this.currentUser._id;
    }

    /* Sanitizing the user's avatar */
    if (this.comm) {
      this.sanitize(this.comm.user.avatar);
      this.avatarUrl = this.avatarService.generateAvatar(this.comm.user.name);
    }

  }

  randomColor(): string {

    let colors = ["teal", "orange", "orange", "red", "blue"];

    let i = Math.floor(Math.random() * (4 - 0 + 1)) + 0;

    this.color = colors[i];

    return this.color;
  }

  /* Cleans and sanitizes the image for display */
  sanitize(base64String) {
    this.imagePath = this.sanitizer.bypassSecurityTrustResourceUrl(
      "data:image/jpg;base64," + base64String
    );
  }
  /* Cleans and sanitizes the image for display */
  sanitizeCommAvatar(base64String) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      "data:image/jpg;base64," + base64String
    );
  }

  /* Method for deleting a community blog post */
  deleteComm() {
    this.communityService.deleteComm(this.comm._id).subscribe(
      data => {
        this.router.navigate(["home"]).then(()=> this.router.navigate(['konnect']));
      },
      error => {
        if (error) {
          this.toast.danger("Error", error.error.errors[0].msg);
        }
      }
    );
  }

  hasLiked() {
    const { likes } = this.comm;
    return (likes as Array<any>).indexOf(this.userId) >= 0;
  }

  hasDisliked() {
    const { dislikes } = this.comm;
    return (dislikes as Array<any>).indexOf(this.userId) >= 0;
  }

  commLiking() {
    if (this.auth.isUserLoggedIn()) {
      this.communityService.commLiking(this.comm._id).subscribe(
        data => {
          this.comm = data;
        },
        error => {
          if (error) {
            this.toast.danger("Error", error.error.errors[0].msg);
          }
        }
      );
    } else {
      this.toast.warning("Signin!", "Please signs in to react to posts");
    }
  }

  /* Method for disliking a psecific community blog post */
  commDisliking() {
    if (this.auth.isUserLoggedIn()) {
      this.communityService.commDisliking(this.comm._id).subscribe(
        data => {
          this.comm = data;
        },
        error => {
          if (error) {
            this.toast.danger("Error", error.error.errors[0].msg);
          }
        }
      );
    } else {
      this.toast.warning("Signin!", "Please signs in to react to posts");
    }
  }

  /* Method for commenting on a blog post */
  addComment() {
    if (this.auth.isUserLoggedIn() && this.currentUser) {
      this.communityService
        .addComment(this.commentText, this.comm._id)
        .subscribe(data => {
          console.log(data);
          this.comm = data;
          console.log(this.comm);
        });
    }
  }

  /* Method for deleting a specific blog post */
  deleteComment(comment_id: string) {
    this.communityService.deleteComment(comment_id, this.comm._id).subscribe(
      data => {
        this.comm = data;
        console.log(data);
      },
      error => {
        if (error) {
          this.toast.danger("Error", error.error.errors[0].msg);
        }
      }
    );
  }
}

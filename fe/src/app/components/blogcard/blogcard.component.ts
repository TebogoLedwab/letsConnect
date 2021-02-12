import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BlogService } from 'src/app/providers/blog.service';
import { ToastService } from 'src/app/providers/toast.service';
import { AuthService } from 'src/app/providers/auth.service';
import { Router } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-blogcard',
  templateUrl: './blogcard.component.html',
  styleUrls: ['./blogcard.component.scss']
})
export class BlogcardComponent implements OnInit {

  @ViewChild('editBlogModal', { static: true }) editBlogModal: ModalDirective;

  @Input() blog;
  edtBlog;
  currentUser;

  isEditFileSelected: boolean = false;
  imagePathToEdit;
  imageToEditBase64;

  userId:any;

  constructor(private sanitizer: DomSanitizer,
    private blogService: BlogService,
    private toast: ToastService,
    public auth: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    if (this.auth.isUserLoggedIn()) {
      this.currentUser = this.auth.getCurrentUser();
      this.userId =this.currentUser._id;
    }

    this.edtBlog = JSON.parse(JSON.stringify(this.blog));// cloning profile into currentUser

  }

  hasLiked() {
    const {likes} = this.blog;
    return (likes as Array<any>).indexOf(this.userId)>=0;
  }
  
  hasDisliked() {
    const {dislikes} = this.blog;
    return (dislikes as Array<any>).indexOf(this.userId)>=0;
  }

  /* Cleans and sanitizes the blog image for display */
  sanitizeImage(base64String) {
    return this.sanitizer.bypassSecurityTrustStyle(`url(${base64String})`);
  }

  sanitizeSrcImage(base64String) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`${base64String}`);
  }

  sanitizeUserAvatar(base64String) {
    return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
      + base64String);
  }

  // liking a blog
  blogLiking() {

    if (this.auth.isUserLoggedIn()) {

      this.blogService.blogLiking(this.blog._id).subscribe(
        (data) => {
          this.blog = data;
        },
        (error) => {
          if (error) {
            this.toast.danger('Error', error.error.errors[0].msg);
          }
        }
      );

    } else {
      this.toast.warning('Signin!', "Please signs in to react to posts");
    }
  }

  // disliking a blog
  blogDisliking() {

    if (this.auth.isUserLoggedIn()) {

      this.blogService.blogDisliking(this.blog._id).subscribe(
        (data) => {
          this.blog = data;
        },
        (error) => {
          if (error) {
            this.toast.danger('Error', error.error.errors[0].msg);
          }
        }
      );

    } else {
      this.toast.warning('Signin!', "Please signs in to react to posts");
    }

  }

  // delete blog
  deleteBlog() {


    this.blogService.deleteBlog(this.blog._id).subscribe(
      (data) => {
        this.router.navigate(['home']).then(() => {
          this.router.navigate(['blog'])
        });
      },
      (error) => {
        if (error) {
          this.toast.danger('Error', error.error.errors[0].msg);
        }
      }
    )
  }

  editBlog() {


    if (this.imageToEditBase64) {
      this.edtBlog.image = this.imageToEditBase64;
    }


    this.blogService.editBlog(this.edtBlog, this.blog._id).subscribe(
      (data) => {
        this.toast.success('Success', "Post Edited Successfully");
        this.editBlogModal.hide();
        console.log(data);

        this.blog = data.blogPost;
      },
      (error) => {
        if (error) {
          this.toast.danger('Error', error.error.errors[0].msg);
        }
      }
    )


  }

  // view a single blog
  view_blog = () => this.router.navigate(['blog', this.blog._id]);


  /* Called on Image File Select */
  onImageSelect(evt) {
    var files = evt.target.files;
    var file = files[0];

    this.imagePathToEdit = file;
    console.log(this.imagePathToEdit);

    if (files && file) {
      var reader = new FileReader();

      reader.onload = this.handleImageChange.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  /* 
   Called after onImageSelect
   Changes File to Base64
 */
  handleImageChange(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.imageToEditBase64 = 'data:image/jpg;base64,' + btoa(binaryString);
    this.isEditFileSelected = true;

    this.imagePathToEdit = this.sanitizer.bypassSecurityTrustResourceUrl(this.imageToEditBase64);
  }

}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StoreService } from 'src/app/providers/store.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Blog, User } from 'src/app/models/data-type';
import * as _ from 'lodash';
import { DomSanitizer } from '@angular/platform-browser';
import { BlogService } from 'src/app/providers/blog.service';
import { ToastService } from 'src/app/providers/toast.service';
import { AuthService } from 'src/app/providers/auth.service';
import { AvatarService } from 'src/app/providers/avatar.service';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent implements OnInit {

  blog: Blog;
  currentUser;
  avatarUrl;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: StoreService,
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private blogService: BlogService,
    private toast: ToastService,
    private auth: AuthService,
    private avatarService: AvatarService
  ) { }

  ngOnInit(): void {

    if (this.auth.isUserLoggedIn()) {
      this.currentUser = this.auth.getCurrentUser();
    }

    this.spinner.show();
    this.store.GET_BLOGS_STORE().subscribe(blogs => {
      
      this.blog = _.find(blogs, (blog) => blog._id == this.activatedRoute.snapshot.params.id);
      this.avatarUrl = this.avatarService.generateAvatar(this.blog.user.name);

      this.spinner.hide();
      

      if (!this.blog) {
        this.navigate_home();
      }
    });

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
        this.router.navigate(['blog']);
      },
      (error) => {
        if (error) {
          this.toast.danger('Error', error.error.errors[0].msg);
        }
      }
    )
  }
  editBlog(){
    
  }

  // sanitize the blog image
  sanitizeBlogImage(base64String) {
    return this.sanitizer.bypassSecurityTrustStyle(`url(${base64String})`);
  }

  // sanitize the user's avatar
  sanitizeBlogUserAvatar(base64String) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/jpg;base64,${base64String}`);
  }

  // navigate back to home page
  navigate_home = () => this.router.navigate(['home']);

  // view a single profile
  view_profile = (id) => this.router.navigate(['profile', id]);


}

import { Component, OnInit, ViewChild } from '@angular/core';
import { BlogService } from 'src/app/providers/blog.service';
import { StoreService } from 'src/app/providers/store.service';
import { Blog } from 'src/app/models/data-type';
import { Router } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastService } from 'src/app/providers/toast.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/providers/auth.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  @ViewChild('postBlogModal', { static: true }) postBlogModal: ModalDirective;
  blogs: Array<Blog>;
  allBlogs: Array<Blog>;

  newBlog: Blog = new Blog();

  isFileSelected = false;
  imageToUploadBase64: string;
  imagePathToUpload;

  constructor(private blogService: BlogService, public auth:AuthService, private store: StoreService, private router: Router,
    private toast: ToastService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getBlogs();
    console.log(this.auth.isUserLoggedIn());
    
  }

  // Get All blogs
  getBlogs() {
    this.blogService.getBlogs().subscribe(
      (blogs) => {
        // set blogs in the store
        this.store.SET_BLOG_STORE(blogs);
        // set blogs
        this.blogs = blogs;
        this.allBlogs = blogs;
      }
    )
  }

  /* Post blog method */
  postBlog() {

    if (this.imageToUploadBase64) {
      this.newBlog.image = this.imageToUploadBase64;
    }

    this.blogService.postBlog(this.newBlog).subscribe(
      (data) => {

        this.ngOnInit();
        this.postBlogModal.hide();
        this.toast.success('Success', "Posted Successfully");

        this.newBlog = new Blog();


      }, (error) => {
        if (error) {
          this.toast.danger('Error', error.error.errors[0].msg);
        }
      });
  }

  // view a single profile
  view_blog = (blog_id) => this.router.navigate(['blog', blog_id]);

  // on handle filter logics
  handle_filter(event) {

    if (event == "Newest") {

      this.blogs = this.allBlogs.sort((a, b) => {
        return a.datePosted.getTime() - b.datePosted.getTime();
      });

    }

    if (event == "Oldest") {

      this.blogs = this.allBlogs.filter(function (blog) {
        return blog.title
      });

    }

  }

  // handle search logics
  handle_search(event) {

    if (event == ''  ) {// If empty show all
      this.blogs = this.allBlogs;
    } else {

      // Else filter
      var newBlogs = this.allBlogs.filter(function (blog) {
        return blog.title.toLowerCase().includes(event.toLowerCase());// make all to lowercase 'cause it's case sensitive
      });

      this.blogs = newBlogs;
    }

  }

  /* Called on Image File Select */
  onImageSelect(evt) {
    var files = evt.target.files;
    var file = files[0];

    this.imagePathToUpload = file;

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
    this.imageToUploadBase64 = 'data:image/jpg;base64,' + btoa(binaryString);
    this.isFileSelected = true;

    this.imagePathToUpload = this.sanitizer.bypassSecurityTrustResourceUrl(this.imageToUploadBase64);
  }

}

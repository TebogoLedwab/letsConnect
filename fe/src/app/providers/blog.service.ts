import { Blog, User } from './../models/data-type';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, tap, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  /**
   * API_URL holds your api url address + port to the backend only
   * example (http://localhost:5000)
   */
  API_URL: string = environment.API_URL;

  // set default content-type header to application/json
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient, private auth: AuthService) { }

  // Getting all blogs
  getBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.API_URL}/blogs`)
      .pipe(
        catchError(this.handleError)
      )
  }

  // Post A Blog
  postBlog(blog: Blog): any {
    let headers = this.headers.append('x-auth-token', this.auth.getAccessToken());
    return this.http.post(`${this.API_URL}/blogs`, blog, { headers });
  }

  // Liking blog
  blogLiking(post_id: string): any {
    let headers = this.headers.append('x-auth-token', this.auth.getAccessToken());
    return this.http.put(`${this.API_URL}/blogs/likes/${post_id}`, {}, { headers });
  }

  // Disliking post
  blogDisliking(post_id: string): any {
    let headers = this.headers.append('x-auth-token', this.auth.getAccessToken());
    return this.http.put(`${this.API_URL}/blogs/dislikes/${post_id}`, {}, { headers });
  }

  // Deleting a post
  deleteBlog(blog_id: string) {
    this.headers = this.headers.append('x-auth-token', this.auth.getAccessToken());
    return this.http.delete(`${this.API_URL}/blogs/${blog_id}`, { headers: this.headers })
  }

  editBlog(blog: Blog, blog_id): any {
    let headers = this.headers.append('x-auth-token', this.auth.getAccessToken());
    return this.http.put(`${this.API_URL}/blogs/${blog_id}`, blog, { headers });
  }

  // handle error
  handleError(error: HttpErrorResponse) {
    console.log(error.statusText);
    return throwError(error);
  }

}

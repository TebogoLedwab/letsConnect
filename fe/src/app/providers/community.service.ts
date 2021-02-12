import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { ToastService } from './toast.service';


@Injectable({
  providedIn: 'root'
})
export class CommunityService {

  API_URL: string = environment.API_URL;

  constructor(private httpClient: HttpClient, private authService: AuthService, private toast:ToastService) { }

  postComm(comm: any): any {
    let headers = new HttpHeaders().set('x-auth-token', this.authService.getAccessToken())
      .set('Content-Type', 'application/json');
    return this.httpClient.post(`${this.API_URL}/community`, comm, { headers });
  }

  getAllComms(): any {
    return this.httpClient.get(`${this.API_URL}/community`);
  }

  deleteComm ( comm_id: any ): any {
    let headers = new HttpHeaders().set( 'x-auth-token', this.authService.getAccessToken() )
      .set( 'Content-Type', 'application/json' );
    return this.httpClient.delete( `${this.API_URL}/community/${comm_id}`, { headers } );
  }

  addComment ( comment: string, post_id: string ): any {
    let headers = new HttpHeaders().set( 'x-auth-token', this.authService.getAccessToken() )
      .set( 'Content-Type', 'application/json' );
    return this.httpClient.put( `${this.API_URL}/community/comments/${post_id}`, { comment: comment }, { headers } );
  }

  deleteComment ( comment_id: string, post_id: string ) {
    let headers = new HttpHeaders().set( 'x-auth-token', this.authService.getAccessToken() )
      .set( 'Content-Type', 'application/json' )
    return this.httpClient.delete( `${this.API_URL}/community/${post_id}/comments/${comment_id}`, { headers } );
  }

  commLiking ( post_id: string ): any {
    let headers = new HttpHeaders().set( 'x-auth-token', this.authService.getAccessToken() )
      .set( 'Content-Type', 'application/json' )
    return this.httpClient.put( `${this.API_URL}/community/likes/${post_id}`, {}, { headers } );
  }

  commDisliking ( post_id: string ): any {
    let headers = new HttpHeaders().set( 'x-auth-token', this.authService.getAccessToken() )
      .set( 'Content-Type', 'application/json' )
    return this.httpClient.put( `${this.API_URL}/community/dislikes/${post_id}`, {}, { headers } );
  }
}

import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
  HttpHeaders
} from '@angular/common/http';
import { Profile, Experience, User } from '../models/data-type';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  /**
   * API_URL holds your api url address + port to the backend only
   * example (http://localhost:5000)
   */
  API_URL: string = environment.API_URL;

  // set default content-type header to application/json
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    private http: HttpClient,
    private authService: AuthService) { }

  get() {
    return this.http
      .get<any>('https://ui-avatars.com/api/?name=John+Doe');
  }

  // Get All Profiles
  getProfiles(): Observable<Profile[]> {
    return this.http
      .get<Profile[]>(`${this.API_URL}/profiles`)
      .pipe(catchError(this.handleError));
  }

  // Get Current Logged In User Profile
  getCurrentUserProfile() {
    let headers = this.headers.append('x-auth-token', this.authService.getAccessToken());
    return this.http.get(`${this.API_URL}/profiles/me`, { headers });
  }

  // GET User Profile
  getUserProfile() {
    const headers = new HttpHeaders()
      .set('x-auth-token', this.authService.getAccessToken())
      .set('Content-Type', 'application/json');
    return this.http.get(`${this.API_URL}/profiles/me`, { headers });
  }

  // Update User
  updateUser(user: any) {
    let headers = this.headers.append('x-auth-token', this.authService.getAccessToken());
    return this.http.put(`${this.API_URL}/users`, user, { headers: headers });
  }

  // Update User Profile
  updateUserProfile(profile: any): any {
    let headers = this.headers.append('x-auth-token', this.authService.getAccessToken());
    return this.http.post(`${this.API_URL}/profiles`, profile, { headers: headers });
  }

  // Update User Status
  updateUserStatus(profile: any): any {
    let headers = this.headers.append('x-auth-token', this.authService.getAdminToken());
    return this.http.put(`${this.API_URL}/profiles/${profile.user._id}`, profile, { headers });
  }

  // POST Work Experience
  addExperience(experience): Observable<Experience[]> {
    let headers = this.headers.append('x-auth-token', this.authService.getAccessToken());
    return this.http.post<Experience[]>(`${this.API_URL}/profiles/experience`, experience, { headers });
  }

  // Delete Work Experience
  deleteExperience(id): Observable<Experience[]> {
    let headers = this.headers.append('x-auth-token', this.authService.getAccessToken());
    return this.http.delete<Experience[]>(`${this.API_URL}/profiles/experience/${id}`, { headers });
  }

  deleteNotification(id) {
    let headers = this.headers.append('x-auth-token', this.authService.getAccessToken());
    return this.http.delete(`${this.API_URL}/profiles/notifications/${id}`, { headers });
  }

  // Apply
  // apply(): Observable<Profile> {
  //   let headers = this.headers.append('x-auth-token', this.authService.getAccessToken());
  //   return this.http.post<Profile>(`${this.API_URL}/apply`, {}, { headers });
  // }

  // handle error
  handleError(error: HttpErrorResponse) {
    console.log(error.statusText);
    return throwError(error);
  }
}
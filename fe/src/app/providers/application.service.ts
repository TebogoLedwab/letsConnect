import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile } from '../models/data-type';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  
  /**
   * API_URL holds your api url address + port to the backend only
   * example (http://localhost:5000)
   */
  API_URL: string = environment.API_URL;

  // set default content-type header to application/json
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient, private authService: AuthService) { }

  apply(): Observable<Profile> {
    let headers = this.headers.append('x-auth-token', this.authService.getAccessToken());
    return this.http.post<Profile>(`${this.API_URL}/apply`, {}, { headers });
  }

  getApplications(): Observable<any[]> {
    let headers = this.headers.append('x-auth-token', this.authService.getAdminToken());
    return this.http.get<any[]>(`${this.API_URL}/apply/applications`, { headers });
  }

  updateAppplication(application): Observable<any> {
    let headers = this.headers.append('x-auth-token', this.authService.getAdminToken());
    return this.http.put<any>(`${this.API_URL}/apply`, application, { headers });
  }

  deleteAppplication(id): Observable<any> {
    let headers = this.headers.append('x-auth-token', this.authService.getAdminToken());
    return this.http.delete<any>(`${this.API_URL}/apply/${id}`, { headers });
  }

}

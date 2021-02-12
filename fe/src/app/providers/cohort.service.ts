import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Cohort } from '../models/data-type';

@Injectable({
  providedIn: 'root'
})
export class CohortService {

  /**
   * API_URL holds your api url address + port to the backend only
   * example (http://localhost:5000)
   */
  API_URL: string = environment.API_URL;

  // set default content-type header to application/json
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient, private authService: AuthService) { }

  addCohort(cohort: Cohort): Observable<Cohort> {
    let headers = this.headers.append('x-auth-token', this.authService.getAdminToken());
    return this.http.post<Cohort>(`${this.API_URL}/cohorts`, cohort, { headers });
  }

  getCohorts(): Observable<Cohort[]> {
    let headers = this.headers.append('x-auth-token', this.authService.getAdminToken());
    return this.http.get<Cohort[]>(`${this.API_URL}/cohorts`, { headers });
  }

  updateCohort(cohort: Cohort): Observable<any> {
    let headers = this.headers.append('x-auth-token', this.authService.getAdminToken());
    return this.http.put<Cohort>(`${this.API_URL}/cohorts/${cohort._id}`, cohort, { headers });
  }

  deleteCohort(id): Observable<any> {
    let headers = this.headers.append('x-auth-token', this.authService.getAdminToken());
    return this.http.delete<any>(`${this.API_URL}/cohorts/${id}`, { headers });
  }

}

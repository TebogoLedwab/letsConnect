import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from '../models/data-type';

import { Router } from '@angular/router';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**
     * API_URL holds your api url address + port to the backend only
     * example (http://localhost:5000)
     */
  API_URL: string = environment.API_URL;

  // keep current singedin user data
  current_user = {};

  // keep current singedin admin data
  current_admin = {};

  // keep current singedin user data
  current_user_initial: string = null;

  // set default content-type header to application/json
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  //JWT Helper will be used to check if token is valid and if is expired
  jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(private httpClient: HttpClient, private router: Router, private toast: ToastService) { }

  // sings-up new user to the system
  sign_up(user: User): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/users`, user, { headers: this.headers });
  }

  // sign_in method for user authentication
  sign_in(email: string, password: string) {
    return this.httpClient.post<any>(`${this.API_URL}/auth`, { email: email, password: password }, { headers: this.headers});
  }

  // sign_in method for admin authentication
  admin_sign_in(email: string, password: string) {
    return this.httpClient.post<any>(`${this.API_URL}/auth/admin`, { email: email, password: password }, { headers: this.headers });
  }

  // set current user in auth and localstorage
  setCurrentUser(current_user: any) {
    this.current_admin = {};// set curent admin to empty

    this.current_user = current_user;
    this.current_user_initial = (current_user.name.charAt(0)).toUpperCase();

    localStorage.removeItem('current_admin');// Remove Admin If exists
    localStorage.setItem('current_user', JSON.stringify(current_user));
  }

  // get current user in from and localstorage
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('current_user'));
  }

  // set current admin in auth and localstorage
  setCurrentAdmin(current_admin: any) {
    this.current_user = {};// set curent user to empty

    this.current_admin = current_admin;
    this.current_user_initial = (current_admin.name.charAt(0)).toUpperCase();

    localStorage.removeItem('current_user');// Remove User If exists
    localStorage.setItem('current_admin', JSON.stringify(current_admin));
  }

  // get current admin in from  localstorage
  getCurrentAdmin() {
    return JSON.parse(localStorage.getItem('current_admin'));
  }

  // return user token from the storage
  setAccessToken(token): void {
    localStorage.removeItem('admin_token');// Remove Admin Token If exists
    localStorage.setItem('access_token', token);
  }

  // return user token from the storage
  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  // set admin token to the storage
  setAdminToken(token): void {
    localStorage.removeItem('access_token');// Remove User Token If exists
    localStorage.setItem('admin_token', token);// Set Admin Token
  }

  // return admin token from the storage
  getAdminToken() {
    return localStorage.getItem('admin_token');
  }

  // boolean method that return true or false if user is logged in
  isUserLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return (authToken !== null) ? true : false;
  }

  //boolean method that return true if token is valid and not expired
  isUserAuthenticated(): boolean {
    let token = localStorage.getItem('access_token')
    return !this.jwtHelper.isTokenExpired(token);
  }

  // boolean method that return true or false if user is logged in
  isAdminLoggedIn(): boolean {
    let authToken = localStorage.getItem('admin_token');
    return (authToken !== null) ? true : false;
  }

  //boolean method that return true if token is valid and not expired
  isAdminAuthenticated(): boolean {
    let token = localStorage.getItem('admin_token')
    return !this.jwtHelper.isTokenExpired(token);
  }

  //verifies user account using token
  verifyToken(token): any {
    let headers = this.headers.append('x-auth-token', token);// append token to headers
    return this.httpClient.post<any>(`${this.API_URL}/auth/verify`, { token: token }, { headers });
  }

  // get current profile by token
  getUserPerToken(): Observable<any> {
    this.headers = this.headers.append('x-auth-token', this.getAccessToken());// append token to headers
    return this.httpClient.get(`${this.API_URL}/auth`, { headers: this.headers });
  }

  // signs users out
  signout() {
    localStorage.removeItem('access_token');// remove access_token from localstorage
    localStorage.removeItem('current_user');// remove current_user from localstorage

    localStorage.removeItem('admin_token');// remove admin_token from localstorage
    localStorage.removeItem('current_admin');// remove current_adminr from localstorage
    //this.toast.info("Logged Out", "You've Logged Out");
    this.router.navigate(['/home']);
  }

}

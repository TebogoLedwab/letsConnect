import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor (private toastr: ToastrService) { }
  
  success(title: string, message:string): void {
    this.toastr.success( message, title);
  }

  info(title: string, message:string): void {
    this.toastr.info( message, title);
  }

  danger(title: string, message:string): void {
    this.toastr.error( message, title);
  }

  warning(title: string, message:string): void {
    this.toastr.warning( message, title);
  }

  on_input_error () { 
    this.warning( 'Warning', 'Input Error!' );
  }
}

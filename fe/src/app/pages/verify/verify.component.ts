import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/providers/toast.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

  constructor(private auth: AuthService, private route: ActivatedRoute,public router: Router, private toast: ToastService) { }

  ngOnInit() {
    this.verify();
  }

  verify() {

    let token = this.route.snapshot.paramMap.get('token');

    console.log(token);

    this.auth.verifyToken(token).subscribe(
      (data) => {
        this.toast.success('Verified', data.msg);
        this.router.navigate(['home']);
      },
      (error) => {
        if (error) {
          console.log(error);
          this.toast.danger('Error', error.error.msg);
        }
      }

    )


  }
}

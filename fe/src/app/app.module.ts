
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule } from '@angular/common/http';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxBootstrapSliderModule } from 'ngx-bootstrap-slider';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { BannerComponent } from './components/banner/banner.component';
import { FilterComponent } from './components/filter/filter.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommunityComponent } from './pages/community/community.component';
import { BlogComponent } from './pages/blog/blog.component';
import { AuthComponent } from './pages/auth/auth.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { FooterComponent } from './components/footer/footer.component';
import { ForgetComponent } from './components/forget/forget.component';
import { InterncardComponent } from './components/interncard/interncard.component';
import { QuestionComponent } from './components/question/question.component';
import { ToastrModule } from 'ngx-toastr';
import { BlogDetailsComponent } from './pages/blog-details/blog-details.component';
import { BlogcardComponent } from './components/blogcard/blogcard.component';
import { WorkexperienceComponent } from './components/workexperience/workexperience.component';
import { UserdetailsComponent } from './components/userdetails/userdetails.component';
import { FileuploadComponent } from './components/fileupload/fileupload.component';
import { AdmindashboardComponent } from './pages/admindashboard/admindashboard.component';
import { ApplicationsComponent } from './pages/applications/applications.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { InternlistComponent } from './components/internlist/internlist.component';
import { AdminsigninComponent } from './components/adminsignin/adminsignin.component';
import { VerifyComponent } from './pages/verify/verify.component';
import { AboutComponent } from './pages/about/about.component';





@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    BannerComponent,
    FilterComponent,
    DashboardComponent,
    NotfoundComponent,
    NavbarComponent,
    CommunityComponent,
    BlogComponent,
    AuthComponent,
    SigninComponent,
    SignupComponent,
    FooterComponent,
    ForgetComponent,
    InterncardComponent,
    QuestionComponent,
    BlogDetailsComponent,
    BlogcardComponent,
    WorkexperienceComponent,
    UserdetailsComponent,
    FileuploadComponent,
    AdmindashboardComponent,
    ApplicationsComponent,
    StatisticsComponent,
    InternlistComponent,
    AdminsigninComponent,
    VerifyComponent,
    AboutComponent,
  
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
    AppRoutingModule,
    NgxSpinnerModule,
    NgxBootstrapSliderModule,
    HttpClientModule,
    PdfViewerModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      progressBar: true,
      progressAnimation: 'increasing',
    })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

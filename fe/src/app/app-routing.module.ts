import { QuestionComponent } from "./components/question/question.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { NotfoundComponent } from "./pages/notfound/notfound.component";
import { CommunityComponent } from "./pages/community/community.component";
import { BlogComponent } from "./pages/blog/blog.component";
import { AuthComponent } from "./pages/auth/auth.component";
import { BlogDetailsComponent } from "./pages/blog-details/blog-details.component";
import { AuthGuardServiceService } from "./providers/auth-guard-service.service";
import { AdmindashboardComponent } from './pages/admindashboard/admindashboard.component';
import { ApplicationsComponent } from './pages/applications/applications.component';
import { AdminAuthGuardService } from './providers/admin-auth-guard.service';
import { VerifyComponent } from './pages/verify/verify.component';
import { AboutComponent } from './pages/about/about.component';

// this constant default routes to Home, and also send all unknown path to Home
const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "home" },
  { path: "home", component: HomeComponent },
  { path: "profile/:id", component: ProfileComponent },
  { path: "about", component: AboutComponent },
  {
    path: "dash",
    component: DashboardComponent,
    canActivate: [AuthGuardServiceService]
  },
  {
    path: "admindash",
    component: AdmindashboardComponent,
    canActivate: [AdminAuthGuardService]
  },
  { path: "konnect", component: CommunityComponent },
  { path: "blog", component: BlogComponent },
  { path: "blog/:id", component: BlogDetailsComponent },
  { path: "auth", component: AuthComponent },
  { path: 'auth/verify/:token', component: VerifyComponent },
  { path: "404", component: NotfoundComponent },
  { path: "**", redirectTo: "/404" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MaterialnavigationComponent } from './components/materialnavigation/materialnavigation.component';
import { AuthGuard } from './guards/auth.guard';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path : 'attendees',
    component : MaterialnavigationComponent,
    canActivate : [AuthGuard]
  },
  { path : 'login', component : LoginComponent },
  { path : '', component : LoginComponent },
  {
    path : '**',
    component : PageNotFoundComponent,
    canActivate : [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { AttendeesListComponent } from './pages/attendees-list/attendees-list.component';
import { UsersComponent } from './pages/users/users.component';
import { MaterialnavigationComponent } from './components/materialnavigation/materialnavigation.component';

const routes: Routes = [
  { path : '', component : LoginComponent, pathMatch: 'full' },
  {
    path : 'app',
    component: MaterialnavigationComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: AttendeesListComponent,
      },
      {
        path : 'attendees',
        component : AttendeesListComponent,
      },
      {
        path : 'users',
        component : UsersComponent,
      },
      {
        path: '**',
        component: PageNotFoundComponent,
      }
    ]
  },
  { path : 'login', component : LoginComponent },
  {
    path : '**',
    component : PageNotFoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { AttendeesListComponent } from './pages/attendees-list/attendees-list.component';
import { UsersComponent } from './pages/users/users.component';
import { MaterialnavigationComponent } from './components/materialnavigation/materialnavigation.component';
import { ParentDashboardComponent } from './pages/parent-dashboard/parent-dashboard.component';
import { MyChildComponent } from './pages/my-child/my-child.component';
import { AvailabilityComponent } from './pages/availability/availability.component';
import { SchedulingComponent } from './pages/scheduling/scheduling.component';

const routes: Routes = [
  { path: '', component: LoginComponent, pathMatch: 'full' },
  {
    path: 'app',
    component: MaterialnavigationComponent,
    children: [
      {
        path: 'parent_dashboard',
        component: ParentDashboardComponent,
      },
      { path: 'mychild/:id', component: MyChildComponent },
      {
        path: 'attendees',
        component: AttendeesListComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'availabilities',
        component: AvailabilityComponent,
      },
      {
        path: 'scheduling',
        component: SchedulingComponent,
      },
      {
        path: '**',
        component: PageNotFoundComponent,
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

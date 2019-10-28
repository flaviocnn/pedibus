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
import { LinebuilderComponent } from './pages/linebuilder/linebuilder.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { LandpageComponent } from './pages/landpage/landpage.component';
import { RoleGuardService } from './services/guards/role-guard.service';
import { SettingsComponent } from './pages/settings/settings.component';

const routes: Routes = [
  { path: '', component: LoginComponent, pathMatch: 'full' },
  {
    path: 'app',
    component: MaterialnavigationComponent,
    children: [
      {
        path: 'parent_dashboard',
        component: ParentDashboardComponent,
        canActivate: [RoleGuardService],
        data: { role: 'ROLE_USER' }
      },
      {
        path: 'mychild/:id',
        component: MyChildComponent,
        canActivate: [RoleGuardService],
        data: { role: 'ROLE_USER' }
      },
      {
        path: 'attendees',
        component: AttendeesListComponent,
        canActivate: [RoleGuardService],
        data: { role: 'ROLE_USER' }
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [RoleGuardService],
        data: { role: 'ROLE_ADMIN' }
      },
      {
        path: 'availabilities',
        component: AvailabilityComponent,
        canActivate: [RoleGuardService],
        data: { role: 'ROLE_USER' }
      },
      {
        path: 'scheduling',
        component: SchedulingComponent,
        canActivate: [RoleGuardService],
        data: { role: 'ROLE_LINEADMIN' }
      },
      {
        path: 'linebuilder',
        component: LinebuilderComponent,
        canActivate: [RoleGuardService],
        data: { role: 'ROLE_ADMIN' }
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
      {
        path: '',
        component: LandpageComponent,
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

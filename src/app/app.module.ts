import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DemoMaterialModule } from './material-module';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AttendeesListComponent } from './pages/attendees-list/attendees-list.component';
import { MaterialnavigationComponent } from './components/materialnavigation/materialnavigation.component';
import { LayoutModule } from '@angular/cdk/layout';

import { ReservationsService } from './services/reservations.service';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule } from '@angular/forms';
import { AuthGuard } from './guards/auth.guard';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { AuthInterceptor } from './services/auth.interceptor';
import { UsersComponent } from './pages/users/users.component';
import { ListUsersComponent } from './components/list-users/list-users.component';
import { InviteUserComponent } from './components/invite-user/invite-user.component';
import { ParentDashboardComponent, DialogOverviewExampleDialog } from './pages/parent-dashboard/parent-dashboard.component';
import { from } from 'rxjs';
import { ReservationsListComponent } from './components/reservations-list/reservations-list.component';
import { MatDialogModule } from '@angular/material';
import { MyChildComponent } from './pages/my-child/my-child.component';
import { AvailabilityComponent } from './pages/availability/availability.component';
import { CallbackPipe } from './services/callback.pipe';

@NgModule({
  declarations: [
    AppComponent,
    AttendeesListComponent,
    MaterialnavigationComponent,
    LoginComponent,
    PageNotFoundComponent,
    UsersComponent,
    ListUsersComponent,
    InviteUserComponent,
    ParentDashboardComponent,
    ReservationsListComponent,
    DialogOverviewExampleDialog,
    MyChildComponent,
    AvailabilityComponent,
    CallbackPipe
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    LayoutModule,
    FormsModule,
    MatDialogModule
  ],
  entryComponents: [ DialogOverviewExampleDialog],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ReservationsService,
    AuthGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

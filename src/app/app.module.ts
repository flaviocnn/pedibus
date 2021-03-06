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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './guards/auth.guard';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { AuthInterceptor } from './services/auth.interceptor';
import { UsersComponent } from './pages/users/users.component';
import { ListUsersComponent, PromotionDialog } from './components/list-users/list-users.component';
import { InviteUserComponent } from './components/invite-user/invite-user.component';
import { ParentDashboardComponent, DialogOverviewExampleDialog } from './pages/parent-dashboard/parent-dashboard.component';
import { ReservationsListComponent } from './components/reservations-list/reservations-list.component';
import { MatDialogModule, MatInputModule, MatFormFieldModule } from '@angular/material';
import { MyChildComponent } from './pages/my-child/my-child.component';
import { AvailabilityComponent } from './pages/availability/availability.component';
import { CallbackPipe } from './services/callback.pipe';
import { SchedulingComponent } from './pages/scheduling/scheduling.component';
import { DatePipe } from '@angular/common';
import { LinebuilderComponent } from './pages/linebuilder/linebuilder.component';
import { AgmCoreModule,GoogleMapsAPIWrapper } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { SharedService } from './services/shared.service';
import { LandpageComponent } from './pages/landpage/landpage.component';
import { InjectableRxStompConfig, RxStompService, rxStompServiceFactory } from '@stomp/ng2-stompjs';
import { myRxStompConfig } from './my-rx-stomp.config';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SettingsComponent } from './pages/settings/settings.component';
import { ReservationDialogComponent } from './components/reservation-dialog/reservation-dialog.component';

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
    CallbackPipe,
    SchedulingComponent,
    LinebuilderComponent,
    NotificationsComponent,
    LandpageComponent,
    SettingsComponent,
    ReservationDialogComponent,
    PromotionDialog
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    LayoutModule,
    FormsModule,
    MatDialogModule,
    AgmCoreModule.forRoot({ // @agm/core
      apiKey: 'AIzaSyA4yaIqF0mxwALtuUXKl_KujhNAIM_3fYc',
    }),
    AgmDirectionModule,
    ReactiveFormsModule,
  ],
  entryComponents: [ DialogOverviewExampleDialog, ReservationDialogComponent, PromotionDialog],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ReservationsService,
    AuthGuard,
    DatePipe,
    RxStompService
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }

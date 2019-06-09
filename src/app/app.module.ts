import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { RouterModule, Routes } from '@angular/router';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DemoMaterialModule } from './material-module';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { InMemoryDataService } from './services/pedibus';
import { AttendeesListComponent } from './pages/attendees-list/attendees-list.component';
import { MaterialnavigationComponent } from './components/materialnavigation/materialnavigation.component';
import { LayoutModule } from '@angular/cdk/layout';

import { PedibusService } from './services/pedibus.service';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule } from '@angular/forms';
import { AuthGuard } from './guards/auth.guard';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { AuthInterceptor } from './services/auth.interceptor';

const appRoutes: Routes = [
  {
    path: 'attendees',
    component: AttendeesListComponent,
    data: { title: 'Presenze' }
  },
  {
    path: '',
    component: AttendeesListComponent,
    data: { title: 'Presenze' }
  }
];

@NgModule({
  declarations: [
    AppComponent,
    AttendeesListComponent,
    MaterialnavigationComponent,
    LoginComponent,
    PageNotFoundComponent,
  ],
  imports: [
    HttpClientModule,
    // HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService),
    // RouterModule.forRoot(
    //   appRoutes,
    //   { enableTracing: true } // <-- debugging purposes only
    // ),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    LayoutModule,
    FormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    PedibusService,
    AuthGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

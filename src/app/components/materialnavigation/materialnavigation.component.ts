import { Component, ViewChild, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SharedService } from 'src/app/services/shared.service';
import { AttendeesListComponent } from 'src/app/pages/attendees-list/attendees-list.component';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-materialnavigation',
  templateUrl: './materialnavigation.component.html',
  styleUrls: ['./materialnavigation.component.scss']
})
export class MaterialnavigationComponent implements OnInit {

  // TODO remove comment
  // isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  //   .pipe(
  //     map(result => result.matches)
  //   );
  @ViewChild('sidenav', { static: true }) public sidenav: MatSidenav;

  constructor(private breakpointObserver: BreakpointObserver,
    private authenticationService: AuthenticationService,
    private sidenavService: SharedService,
    //private topicSubscription: Subscription
  ) {
  }

  ngOnInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }

  logout() {
    this.authenticationService.logout();
    //this.topicSubscription.unsubscribe();
  }

}

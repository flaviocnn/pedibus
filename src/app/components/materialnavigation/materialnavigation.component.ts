import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SharedService } from 'src/app/services/shared.service';
import { MatSidenav } from '@angular/material';
import { User } from 'src/app/models/daily-stop';

@Component({
  selector: 'app-materialnavigation',
  templateUrl: './materialnavigation.component.html',
  styleUrls: ['./materialnavigation.component.scss']
})
export class MaterialnavigationComponent implements OnInit, OnDestroy {

  // TODO remove comment
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
  @ViewChild('sidenav', { static: true }) public sidenav: MatSidenav;
  user: User;
  count$: Observable<number> = null;
  constructor(private breakpointObserver: BreakpointObserver,
              private authenticationService: AuthenticationService,
              private sharedService: SharedService,
  ) {
  }

  ngOnInit(): void {
    this.sharedService.connectWs();
    this.sharedService.setSidenav(this.sidenav);
    this.authenticationService.currentUser
      .subscribe(u => {
        this.user = u;
      });
    this.count$ = this.sharedService.counter$;
  }
  ngOnDestroy(){
    this.logout();
  }

  logout() {
    this.authenticationService.logout();
    this.sharedService.unsubscribe();
  }

}

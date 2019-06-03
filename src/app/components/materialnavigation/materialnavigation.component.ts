import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-materialnavigation',
  templateUrl: './materialnavigation.component.html',
  styleUrls: ['./materialnavigation.component.css']
})
export class MaterialnavigationComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver, private authenticationService: AuthenticationService) {}

  logout() {
    this.authenticationService.logout();
  }
}

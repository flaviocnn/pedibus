import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { first } from 'rxjs/operators';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  showSpinner: boolean;
  returnUrl: string;
  error: string;

  constructor(private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.authenticationService.logout();
    this.username = '';
    this.password = '';
    this.error = '';
    this.showSpinner = false;
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/app';
  }

  login(): void {
    this.showSpinner = true;
    this.authenticationService.login(this.username, this.password).pipe(first()).subscribe(
      (user) => {
        
        this.router.navigate([this.returnUrl]);
      },
      error => {
        console.log(error);
        this.error = error;
        this.showSpinner = false;
      }
    );
  }
}

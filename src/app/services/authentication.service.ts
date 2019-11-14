import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, Notification } from '../models/daily-stop';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  //public username: String;

  constructor(private http: HttpClient, 
              private sharedService: SharedService) {

    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    console.log(username, password);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post<any>('http://localhost:8080/auth/login', { username, password }, httpOptions)
      .pipe(map(user => {
        if (user && user.token && user.user) {
          if(user.user.administeredLines){
            if(user.user.administeredLines.length > 0){
              user.user.roles.push("ROLE_LINEADMIN");
            }
          }
          localStorage.setItem('currentUser', JSON.stringify(user.user));
          localStorage.setItem('id_token', user.token);
          this.sharedService.setPastNotifications(user.notifications as Notification[]);
          this.currentUserSubject.next(user.user);
        }
        return user;
      }));
  }

  logout() {
    localStorage.clear();
    this.currentUserSubject.next(null);
  }

  confirm(token:string){
    const url = 'http://localhost:8080/auth/confirm/'+ token;
    return this.http.post<any>(url, token).subscribe();
  }
}

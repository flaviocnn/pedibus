import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public username: String;

  constructor(private http: HttpClient) {
    //this.username = JSON.parse(localStorage.getItem('currentUser')).user.username;
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
        if (user && user.token && user.user.id) {
          this.username = user.user.username;
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('id_token', user.token);
          localStorage.setItem('username', user.user.username);

          this.username = user.user.username;
          localStorage.setItem('user_id', user.user.id);
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('id_token');
    this.currentUserSubject.next(null);
  }
}

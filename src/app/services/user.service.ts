import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { tap, catchError, map, retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { User, Line, Stop } from '../models/daily-stop';

const REST_URL = 'http://localhost:8080/users';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { this.mySelf = JSON.parse(localStorage.getItem('currentUser')); }

  public mySelf: User;

  getMyId(): number {
    return this.mySelf.id;
  }

  getMyDefaultStop(): Stop{
    const u: User = this.mySelf;
    if(u.defaultStop){return u.defaultStop};
    if( u.children.length>0) return u.children[0].defaultStop; 
    return null;
  }


  getMyLine(): Line{
    const u: User = JSON.parse(localStorage.getItem('currentUser'));
    if(u.defaultStop){return u.defaultStop.line};
    if( u.administeredLines.length>0) return u.administeredLines[0]; 
    return null;
  }

  getUsers(): Observable<User[]> {
    console.log('getting users');
    const url = REST_URL;
    return this.http.get<User[]>(url, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  postNewUser(user: User){
    const url = 'http://localhost:8080/invite';
    return this.http.post<User>(url, user, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  putUser(user: User) {
    const url = REST_URL;
    return this.http.put<User>(url, user, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error(error);
    return throwError(error);
  }

}

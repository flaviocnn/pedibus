import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { tap, catchError, map, retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { User } from '../models/user';

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

  constructor(private http: HttpClient) { }

  getMyId(): string {
    const id = localStorage.getItem('user_id');
    return id;
  }

  getMyLine(): string{
    return null//
  }

  getUsers(): Observable<User[]> {
    console.log('getting users');
    const url = REST_URL;
    return this.http.get<User[]>(url, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error(error);
    return throwError(error);
  }

}

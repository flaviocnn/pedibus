import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { tap, catchError, map, retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DailyStop, Reservation, Child } from '../models/daily-stop';
import { Router } from '@angular/router';

const REST_URL = 'http://localhost:8080/children';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class ChildrenService {
  constructor(private http: HttpClient,
              private router: Router) { }

  postChild(child: Child) {
    const url = REST_URL;

    return this.http.post<Child>(url, child, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  updateDefaultStop(childId: number, stopId: number) {
    const url = REST_URL + `/${childId}/${stopId}`;
    return this.http.patch<any>(url, httpOptions)
    .subscribe();
  }

  getMyChildren(): Observable<Child[]> {
    const url = REST_URL;

    return this.http.get<Child[]>(url, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // getChild(id: number): Observable<Child> {
  //   const url = REST_URL + `/${id}`;

  //   return this.http.get<Child>(url, httpOptions).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  getChild(id: number): Observable<Child> {
    const url = REST_URL + `/${id}`;
    let newChild: Child = {
      firstName: 'moreno',
      lastName: 'morello',
      id: 666,
      parent: null,
      defaultStop: 3
    };
    return of(newChild);
  }

  private handleError(error: any) {
    if (error.status == 500) {
      console.log('errore 500');
      this.router.navigateByUrl('/login');
    }
    console.error(error);
    return throwError(error);
  }
}

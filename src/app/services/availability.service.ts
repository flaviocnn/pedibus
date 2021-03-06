import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Availability } from '../models/daily-stop';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

const REST_URL = 'http://localhost:8080/availabilities/';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})

export class AvailabilityService {

  constructor(private http: HttpClient) { }

  getUserAvailabilities(userId, date): Observable<Availability[]> {
    const url = REST_URL + `users/${userId}/${date}`;
    return this.http
      .get<Availability[]>(url, httpOptions)
      .pipe(catchError(this.handleError));
  }

  getLinesAvailabilities(line_name, date, is_go: boolean): Observable<Availability[]> {
    const url = REST_URL + `lines/${line_name}/${date}/${is_go}`;
    return this.http
      .get<Availability[]>(url, httpOptions)
      .pipe(catchError(this.handleError));
  }

  postAvailability(av: Availability) {
    const url = REST_URL;
    return this.http.post<Availability>(url, av, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  putAvailability(av: Availability) {
    const url = REST_URL;
    return this.http.put<Availability>(url, av, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error(error);
    return throwError(error);
  }
}

import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Availability } from '../models/daily-stop';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

const REST_URL = 'http://localhost:8080/availability/';

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

  getAvailabilities(userId, date): Observable<Availability[]> {
    const url = REST_URL + `${userId}/${date}`;
    return this.http
      .get<Availability[]>(url, httpOptions)
      .pipe(catchError(this.handleError));
  }

  getLinesAvailabilities(line_name, date, is_go: boolean): Observable<Availability[]> {
    const url = REST_URL + `${line_name}/${date}/${is_go}`;
    return this.http
      .get<Availability[]>(url, httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error(error);
    return throwError(error);
  }
}

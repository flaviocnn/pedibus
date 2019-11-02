import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Availability, Line } from '../models/daily-stop';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

const REST_URL = 'http://localhost:8080/lines/';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})

export class LinesService {

  constructor(private http: HttpClient) { }

  getLines(): Observable<Line[]> {
    const url = REST_URL;
    return this.http
      .get<Line[]>(url, httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error(error);
    return throwError(error);
  }
}

import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { tap, catchError, map, retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DailyStop, Reservation, Stop } from '../models/daily-stop';

const REST_URL = 'http://localhost:8080/lines/';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class StopsService {

  constructor(private http: HttpClient) { }

  getStops(): Observable<Stop[]> {
    console.log('getting daily stops');
    const url = REST_URL + 'Linea_AAA';
    return this.http.get<Stop[]>(url, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  getLineStops(line: string): Observable<DailyStop[]> {
    console.log('getting daily stops');
    const url = REST_URL + line;
    return this.http.get<DailyStop[]>(url, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error(error);
    return throwError(error);
  }
}

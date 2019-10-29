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

  getSortedLineStops(line: string, isGo: boolean): Observable<DailyStop[]> {
    console.log('getting daily stops');
    const url = REST_URL + line;
    return this.http.get<DailyStop[]>(url, httpOptions)
      .pipe(
        catchError(this.handleError),
        map(res => this.sort(res, isGo))
      );
  }

  private handleError(error: any) {
    console.error(error);
    return throwError(error);
  }

  sort(data, isGo): any[] {
    if (data) {
      if (isGo) {
        data.sort((a, b) => a.timeGo !== b.timeGo ? a.timeGo < b.timeGo ? -1 : 1 : 0);
      }
      else {
        data.sort((a, b) => a.timeBack !== b.timeBack ? a.timeBack < b.timeBack ? -1 : 1 : 0);
      }
    }
    return data;
  }
}

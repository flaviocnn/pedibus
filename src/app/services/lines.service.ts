import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Availability, Line, DailyStop, JSONLine } from '../models/daily-stop';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

const REST_URL = 'http://localhost:8080/lines';

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

  getStopsByLine(line: string): Observable<DailyStop[]> {
    console.log('getting daily stops');
    const url = REST_URL + `/${line}`;

    return this.http.get<DailyStop[]>(url, httpOptions)
      .pipe(
        catchError(this.handleError),
        map(res => res.sort((a, b) => a.timeGo !== b.timeGo ? a.timeGo < b.timeGo ? -1 : 1 : 0))
      );
  }

  getLines(): Observable<Line[]> {
    const url = REST_URL;
    return this.http
      .get<Line[]>(url, httpOptions)
      .pipe(catchError(this.handleError));
  }

  postLine(line: JSONLine) {
    const url = REST_URL;
    return this.http.post<JSONLine>(url, line, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error(error);
    return throwError(error);
  }
}

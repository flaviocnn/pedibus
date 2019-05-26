import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Line } from '../models/line';
import { Stop } from '../models/stop';

@Injectable({
  providedIn: 'root'
})
export class PedibusService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private linesUrl = 'api/lines';  // URL to web api
  private stopsUrl = 'api/stops';

  constructor(private http: HttpClient) { }

  getLines(): Observable<Line[]> {
    return this.http.get<Line[]>(this.linesUrl)
    .pipe(
      tap(data => console.log(data)), // eyeball results in the console
      catchError(this.handleError)
    );
  }

  getStops(): Observable<Stop[]> {
    return this.http.get<Stop[]>(this.stopsUrl)
    .pipe(
      tap(data => console.log(data)), // eyeball results in the console
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    // In a real world app, we might send the error to remote logging infrastructure
    // and reformat for user consumption
    console.error(error); // log to console instead
    return throwError(error);
  }

}

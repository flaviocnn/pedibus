import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { tap, catchError, map, retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Line } from '../models/line';
import { Stop } from '../models/stop';
import { DailyStop, Reservation } from '../models/daily-stop';

const REST_URL = 'http://localhost:8080/';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class PedibusService {
  private linesUrl = 'api/lines';  // URL to web api
  private stopsUrl = 'api/stops';

  constructor(private http: HttpClient) { }

  getLines(): Observable<any> {
    const url = REST_URL + 'lines';
    return this.http.get<any>(url, httpOptions)
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

  getDailyStops(date, isGo): Observable<DailyStop[]> {
    console.log('getting daily stops');
    const url = REST_URL + 'reservations/Linea_AAA/' + date + '/' + isGo;
    console.log(url);

    return this.http.get<DailyStop[]>(url, httpOptions ).pipe(
      //tap(data => console.log(data)),
      //retry(3),
      catchError( this.handleError)
    );
  }

  putReservation(id) {
    const url = REST_URL + 'reservations/' + id;
    return this.http.put<number>(url, id, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  newReservation(res){

    const url = REST_URL + 'reservations';

    const newRes: Reservation = {
      date: res.date,
      isGo: res.isGo,
      isBooked: false,
      isConfirmed: true,
      stop: res.stop_id,
      user: res.user.id
    };

    return this.http.post<Reservation>(url, newRes, httpOptions)
      .pipe(
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

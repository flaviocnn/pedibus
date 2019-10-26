import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { tap, catchError, map, retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DailyStop, Reservation } from '../models/daily-stop';

const REST_URL = 'http://localhost:8080/reservations';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {

  constructor(private http: HttpClient) { }

  getDailyStops(date: string, isGo: boolean): Observable<DailyStop[]> {
    console.log('getting daily stops');
    const url = REST_URL + '/lines/Linea_AAA/' + date + '/' + isGo;
    console.log(url);

    return this.http.get<DailyStop[]>(url, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getDailyStopsByLine(date: string, isGo: boolean, line: string): Observable<DailyStop[]> {
    console.log('getting daily stops');
    const url = REST_URL + `/lines/${line}/${date}/${isGo}`;

    return this.http.get<DailyStop[]>(url, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  putReservation(res: Reservation) {
    const url = REST_URL;
    return this.http.put<Reservation[]>(url, res, httpOptions)
    .subscribe();
  }

  postReservation(res: Reservation) {

    const url = REST_URL;
    return this.http.post<Reservation>(url, res, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getReservation(childId: number, date: string, isGo: boolean) {
    const url = REST_URL + `/children/${childId}/${date}/${isGo}`;
    return this.http.get<Reservation>(url, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error(error);
    return throwError(error);
  }

}

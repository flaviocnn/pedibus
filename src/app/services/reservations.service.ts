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

  putReservation(res: Reservation) {
    const url = REST_URL;
    return this.http.put<Reservation[]>(url, res, httpOptions)
    .subscribe();
  }

  postReservation(res: Reservation) {

    const url = REST_URL;

    const newRes: Reservation = {
      date: res.date,
      isGo: res.isGo,
      isBooked: false,
      isConfirmed: true,
      stop: res.stop,
      user: res.user
    };

    return this.http.post<Reservation>(url, newRes, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getReservations(childId: number, rdate: string) {
    let newres: Reservation = {
      id: 1,
      date: rdate,
      isGo: true,
      isBooked: true,
      stop: {id: 3, name: 'fake stop'},
      user: {id: childId},
    };
    // let resArr: Reservation[] = [];
    // resArr.push(newres);
    return of(newres);
  }

  private handleError(error: any) {
    console.error(error);
    return throwError(error);
  }

}

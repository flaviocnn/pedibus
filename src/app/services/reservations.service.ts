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

    return this.http.get<DailyStop[]>(url, httpOptions)
      .pipe(
        map(res => this.sort(res))
      );
  }

  getAllDailyStopsByLine(date: string, isGo: boolean, line: string): Observable<DailyStop[]> {
    console.log('getting daily stops');
    const url = REST_URL + `/lines/${line}/${date}/${isGo}/all`;

    return this.http.get<DailyStop[]>(url, httpOptions)
      .pipe(
        map(res => this.sortStops(res, isGo))
      );
  }

  putReservation(res: Reservation) {
    const url = REST_URL;
    return this.http.put<Reservation[]>(url, res, httpOptions)
      .subscribe();
  }

  putReservationFromParent(res: Reservation) {
    const url = REST_URL + '-parent';
    return this.http.put<Reservation[]>(url, res, httpOptions)
  }

  deleteReservation(id){
    const url = REST_URL + '/' + id;
    return this.http.delete<Reservation[]>(url)
    .pipe(
      catchError(this.handleError)
    );
  }

  postReservation(res: Reservation) {
    const url = REST_URL;
    return this.http.post<Reservation>(url, res, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  postEndReservation(date: string, isGo: boolean, linename: string){
    const url = REST_URL +  `/lines/${linename}/${date}/${isGo}/done`;
    return this.http.post<Reservation>(url, {}, httpOptions)
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
  sort(data): any[] {
    if (data) {
      data.sort((a, b) => a.timeGo !== b.timeGo ? a.timeGo < b.timeGo ? -1 : 1 : 0);
      data.forEach(el => {
        if (el.reservations) {
          el.reservations.sort((a, b) => {
            a.child.firstName !== b.child.firstName ? a.child.firstName < b.child.firstName ? -1 : 1 : 0;
          });
        }
      });
    }

    return data;
  }

  sortStops(data, isGo): any[] {
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

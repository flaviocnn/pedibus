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

    // let params = new HttpParams();
    // params = params.append('user_id', userId);
    // params = params.append('date', date);
    return this.http.get<Availability[]>(url, httpOptions)
    .pipe();
  }

  private handleError(error: any) {
    console.error(error);
    return throwError(error);
  }
}

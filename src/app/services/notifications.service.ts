import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


const REST_URL = 'http://localhost:8080/notifications/';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private http: HttpClient, ) { }

  getNotifications(): any {
    const url = REST_URL;
    return this.http.get<any>(url, httpOptions);
  }
}

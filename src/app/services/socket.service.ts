import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Message {
  message: string,
  fromId: string,
  toId: string,
}
@Injectable()
export class SocketService {
  url: string = environment.url + "api/socket";

  constructor(private http: HttpClient) { }

  post(data: Message) {
    return this.http.post(this.url, data)
      .pipe();
  }
}
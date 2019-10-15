import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CreateAccountService {
  private API_PATH = 'http://localhost:8080/auth/invite/';
  constructor(private httpClient: HttpClient) { }

  createAccount(username: string) {
    return this.httpClient.post(`${this.API_PATH}${username}`, null, {});
  }
}

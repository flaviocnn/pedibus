import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  getMyId(): string {
    const id = localStorage.getItem('user_id');
    return id;
  }
}

import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from '../../environments/environment';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class WssService {

    private serverUrl = environment.url + 'ws'
    private isLoaded: boolean = false;
    private stompClient;

    constructor(private authService : AuthenticationService) {
        this.initializeWebSocketConnection()
    }
  
    initializeWebSocketConnection() {
      let ws = new SockJS(this.serverUrl);
      this.stompClient = Stomp.over(ws);
      let that = this;
      this.stompClient.connect({}, function () {
        that.isLoaded = true;
        if(that.authService.username) {
          that.subscribeOnTopic(that.authService.username);
        }
      });
    }
  
    public subscribeOnTopic(username: String) {
        if(this.isLoaded) {
            this.stompClient.subscribe('/user/' + username + '/queue', function (msgOut) {
                console.log(msgOut);
            });
        }
    }
}

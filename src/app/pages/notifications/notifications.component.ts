import { Component, OnInit, OnDestroy } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { WebSocketAPI } from 'src/app/web-socket-api';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  
  constructor() {
  }
  webSocketAPI: WebSocketAPI;
  greeting: any;
  name: string;
  ngOnInit() {
    this.webSocketAPI = new WebSocketAPI(new NotificationsComponent());
  }
  connect(){
    this.webSocketAPI._connect();
  }

  disconnect(){
    this.webSocketAPI._disconnect();
  }

  sendMessage(){
    this.webSocketAPI._send(this.name);
  }

  handleMessage(message){
    this.greeting = message;
  }
}


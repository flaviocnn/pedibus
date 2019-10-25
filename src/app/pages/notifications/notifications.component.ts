import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from '../../../environments/environment';
import { SocketService } from '../../services/socket.service';

export interface Message {
  message: string,
  fromId: string,
  toId: string,
}
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  private serverUrl = environment.url + 'ws'
  isLoaded: boolean = false;
  isCustomSocketOpened = false;
  private stompClient;
  private form: FormGroup;
  private userForm: FormGroup;
  messages: Message[] = [];
  constructor(private socketService: SocketService
  ) { }

  ngOnInit() {
    this.initializeWebSocketConnection();
  }

  sendMessageUsingSocket() {
    if (this.form.valid) {
      let message: Message = { message: this.form.value.message, fromId: this.userForm.value.fromId, toId: this.userForm.value.toId };
      this.stompClient.send("/app/hello", {}, JSON.stringify(message));
    }
  }

  sendMessageUsingRest() {
    if (this.form.valid) {
      let message: Message = { message: this.form.value.message, fromId: this.userForm.value.fromId, toId: this.userForm.value.toId };
      this.socketService.post(message).subscribe(res => {
        console.log(res);
      })
    }
  }

  initializeWebSocketConnection() {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function (frame) {
      that.isLoaded = true;
      //console.log("first step");
      that.openGlobalSocket();
    });
  }

  openGlobalSocket() {
    this.stompClient.subscribe("/topic/greetings", (message) => {
      this.handleResult(message);
    });
  }

  openSocket() {
    if (this.isLoaded) {
      this.isCustomSocketOpened = true;
      this.stompClient.subscribe("/user/queue/reply"+this.userForm.value.fromId, (message) => {
        this.handleResult(message);
      });
    }
  }

  handleResult(message){
    if (message.body) {
      let messageResult: Message = JSON.parse(message.body);
      console.log(messageResult);
      this.messages.push(messageResult);
    }
  }

}

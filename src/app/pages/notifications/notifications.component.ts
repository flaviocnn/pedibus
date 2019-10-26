import { Component, OnInit, OnDestroy } from '@angular/core';

import { RxStompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/daily-stop';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit,OnDestroy {
  public receivedMessages: string[] = [];
  private topicSubscription: Subscription;

  constructor(private rxStompService: RxStompService,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    const un = localStorage.getItem('username');
    this.topicSubscription = this.rxStompService.watch(`/user/${un}/queue`)
    .subscribe((message: Message) => {
      this.receivedMessages.push(message.body);
      //console.log(message.body);
      this.openSnackBar(message.body);
    });
  }

  ngOnDestroy() {
    //this.topicSubscription.unsubscribe();
  }

  onSendMessage() {
    const message = `Message generated at ${new Date}`;
    this.rxStompService.publish({destination: '/app/hello', body: message});
  }

  openSnackBar(msg) {
    this._snackBar.open(msg, 'Disse Antonio', {
      duration: 5000,
    });
  }

}

import { Injectable } from '@angular/core';
import { MatSidenav, MatSnackBar } from '@angular/material';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Subscription, BehaviorSubject, Observable, Subject } from 'rxjs';
import { Message } from '@stomp/stompjs';

@Injectable({
    providedIn: 'root'
  })
export class SharedService {

    public receivedMessages: string[] = [];
    private topicSubscription: Subscription;

    public notifications$: Subject<string[]> = new BehaviorSubject([]);

    private sidenav: MatSidenav;

    constructor(
    private rxStompService: RxStompService,
    private snackBar: MatSnackBar){
    }

    public setSidenav(sidenav: MatSidenav) {
        this.sidenav = sidenav;
    }

    public open() {
        return this.sidenav.open();
    }


    public close() {
        return this.sidenav.close();
    }

    public toggle(): void {
        this.sidenav.toggle();
    }

    connectWs() {
        const un = JSON.parse(localStorage.getItem('currentUser')).username;
        this.topicSubscription = this.rxStompService.watch(`/user/${un}/queue`)
        .subscribe((message: Message) => {
          this.receivedMessages.push(message.body);
          this.openSnackBar(message.body);
          this.notifications$.next(this.receivedMessages);
        });
      }
    
      openSnackBar(msg) {
        this.snackBar.open(msg, 'Ok', {
          duration: 5000,
        });
      }

      unsubscribe(){
          this.topicSubscription.unsubscribe();
      }
}
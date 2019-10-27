import { Injectable } from '@angular/core';
import { MatSidenav, MatSnackBar } from '@angular/material';
import { RxStompService, InjectableRxStompConfig } from '@stomp/ng2-stompjs';
import { Subscription, BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { Message } from '@stomp/stompjs';

@Injectable({
    providedIn: 'root'
  })
export class SharedService {

    public receivedMessages: string[] = [];
    private topicSubscription: Subscription;

    public notifications$: Subject<string[]> = new BehaviorSubject([]);
    public counter$: Subject<number> = new BehaviorSubject(0);
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

        const config: InjectableRxStompConfig = { 
          brokerURL: 'ws://localhost:8080/ws', 
          connectHeaders: { "Bearer": localStorage.getItem("id_token") } 
        };
        this.rxStompService.configure(config);
        this.rxStompService.activate();
        
        this.topicSubscription = this.rxStompService.watch(`/user/${un}/queue`)
        .subscribe((message: Message) => {
          this.receivedMessages.push(message.body);
          this.counter$.next(this.receivedMessages.length);
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

      clearNotifications(){
        this.receivedMessages = [];
        this.counter$.next(this.receivedMessages.length);
      }
}
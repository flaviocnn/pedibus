import { Injectable, OnInit } from '@angular/core';
import { MatSidenav, MatSnackBar } from '@angular/material';
import { RxStompService, InjectableRxStompConfig } from '@stomp/ng2-stompjs';
import { Subscription, BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { Message } from '@stomp/stompjs';
import { Notification, Reservation } from '../models/daily-stop';

@Injectable({
  providedIn: 'root'
})
export class SharedService implements OnInit {

  private init = false;
  private un;
  public receivedNotifications: Notification[];
  private topicSubscription: Subscription;
  private attendeesSubscription: Subscription;

  public notifications$: Subject<Notification[]> = new BehaviorSubject([]);
  public counter$: Subject<number> = new BehaviorSubject(0);
  public attendees$: Subject<string> = new BehaviorSubject(null);

  public sidenav: MatSidenav;

  config: InjectableRxStompConfig = {
    brokerURL: 'ws://localhost:8080/ws',
    connectHeaders: {
      login: '',
      passcode: '',
      Bearer: localStorage.getItem('id_token')
    },
    heartbeatIncoming: 0, // Typical value 0 - disabled
    heartbeatOutgoing: 20000,
    reconnectDelay: 200,

    debug: (msg: string): void => {
      console.log(new Date(), msg);
    }
  };

  constructor(
    private rxStompService: RxStompService,
    private snackBar: MatSnackBar) {
  }

  ngOnInit() {

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
    this.rxStompService.configure(this.config);
    this.rxStompService.activate();
    this.un = JSON.parse(localStorage.getItem('currentUser')).username;
    this.topicSubscription = this.rxStompService
    .watch(`/user/${this.un}/queue`, { Bearer: localStorage.getItem('id_token') })
      .subscribe((message: Message) => {
        const newNotification = JSON.parse(message.body);
        this.receivedNotifications.push(newNotification);
        this.counter$.next(this.receivedNotifications.length);
        this.openSnackBar(newNotification.text);
        this.notifications$.next(this.receivedNotifications);
      });
  }

  watchAttendees() {
    this.attendeesSubscription = this.rxStompService
      .watch(`/user/${this.un}/queue/attendees`, { Bearer: localStorage.getItem('id_token') })
      .subscribe((msg: Message) => {
        const date = JSON.parse(msg.body).date;
        // const currentValue = this.attendeesItems$.value;
        // const updatedValue = [...currentValue, newItem];
        this.attendees$.next(date);
      });
  }


  closeAttendees() {
    this.attendeesSubscription.unsubscribe();
  }

  openSnackBar(msg) {
    this.snackBar.open(msg, 'Ok', {
      duration: 5000,
    });
  }

  unsubscribe() {
    this.topicSubscription.unsubscribe();
  }

  clearNotifications() {
    this.receivedNotifications = [];
    this.counter$.next(this.receivedNotifications.length);
  }

  setPastNotifications(n: Notification[]) {
    this.receivedNotifications = n;
    this.notifications$.next(this.receivedNotifications);
    this.counter$.next(this.receivedNotifications.length);
  }
}
import { Injectable, OnInit } from '@angular/core';
import { MatSidenav, MatSnackBar, MatSnackBarConfig } from '@angular/material';
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
  private receivedNotifications: Notification[] = [];
  private topicSubscription: Subscription;
  private attendeesSubscription: Subscription;
  private availabilitiesSubscription: Subscription;
  private schedulingSubscription: Subscription;

  public notifications$: Subject<Notification[]> = new BehaviorSubject([]);
  public counter$: Subject<number> = new BehaviorSubject(0);
  public attendees$: Subject<string> = new BehaviorSubject(null);
  public availabilities$: Subject<string> = new BehaviorSubject(null);
  public scheduling$: Subject<string> = new BehaviorSubject(null);

  public sidenav: MatSidenav;

  configSuccess: MatSnackBarConfig = {
    panelClass: 'style-success',
    duration: 3000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
  };

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

  watchAvailabilities() {
    this.availabilitiesSubscription = this.rxStompService
      .watch(`/user/${this.un}/queue/availabilities`, { Bearer: localStorage.getItem('id_token') })
      .subscribe((msg: Message) => {
        const date = JSON.parse(msg.body).date;
        this.availabilities$.next(date);
      });
  }

  watchScheduling() {
    this.schedulingSubscription = this.rxStompService
      .watch(`/user/${this.un}/queue/scheduling`, { Bearer: localStorage.getItem('id_token') })
      .subscribe((msg: Message) => {
        const date = JSON.parse(msg.body).date;
        this.scheduling$.next(date);
      });
  }

  closeScheduling() {
    this.schedulingSubscription.unsubscribe();
  }

  closeAvailabilities() {
    this.availabilitiesSubscription.unsubscribe();
  }

  closeAttendees() {
    this.attendeesSubscription.unsubscribe();
  }

  openSnackBar(msg) {
    this.snackBar.open(msg,'Ok', this.configSuccess);
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
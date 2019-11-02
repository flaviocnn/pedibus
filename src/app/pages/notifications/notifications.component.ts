import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { Notification } from 'src/app/models/daily-stop';
import { NotificationsService } from 'src/app/services/notifications.service';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  msgs: Notification[] = [];
  title = 'Notifiche';
  constructor( 
    private sharedService: SharedService,
    private notificationService: NotificationsService) { }

  ngOnInit(){
    this.sharedService.notifications$.subscribe(
      (data) =>{ 
        data.forEach(n => this.msgs.push(n))
        }
    );
    this.notificationService.getNotifications();
  }

  ngOnDestroy(){
    this.sharedService.clearNotifications();
  }
  toggleRightSidenav() {
    this.sharedService.toggle();
  }
}

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
  notifications: Notification[] = [];
  title = 'Notifiche';
  notNew = false;
  constructor( 
    private sharedService: SharedService,
    private notificationService: NotificationsService
    ) { }

  ngOnInit(){
    
    this.sharedService.notifications$.subscribe(
      (data) =>{ 
        this.getNotifications();
        //this.sharedService.clearNotifications();
        //console.log(this.notifications);
        this.notNew = true;
      }
    );
    if(!this.notNew){
      this.getNotifications();
    }
    
  }

  getNotifications(){
    this.notifications = [];
    this.notificationService.getNotifications().subscribe(
      (data) => {
        this.notifications = data;
      }
    );
  }
  ngOnDestroy(){
    this.notifications = [];
    this.sharedService.clearNotifications();
  }
  toggleRightSidenav() {
    this.sharedService.toggle();
  }
}

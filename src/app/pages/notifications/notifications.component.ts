import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  public receivedMessages: string[] = [];
  msgs: Notification[] = [];

  constructor( private sharedService: SharedService) { }

  ngOnInit(){
    this.sharedService.notifications$.subscribe(
      (data) =>{ 
        data.forEach(msg =>{
          this.msgs.push(JSON.parse(msg));
        });
        }
    );
  }

  ngOnDestroy(){
    this.sharedService.clearNotifications();
  }

  onSendMessage() {
    const message = `Message generated at ${new Date}`;
    //this.rxStompService.publish({destination: '/app/hello', body: message});
  }


}

import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  public receivedMessages: string[] = [];
  msgs: string[];

  constructor( private sharedService: SharedService) { }

  ngOnInit(){
    this.sharedService.notifications$.subscribe(
      (data) =>{ this.msgs = data;}
    );
  }

  onSendMessage() {
    const message = `Message generated at ${new Date}`;
    //this.rxStompService.publish({destination: '/app/hello', body: message});
  }


}

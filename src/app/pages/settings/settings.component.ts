import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/daily-stop';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  title = 'Impostazioni';
  user: User;
  constructor(private sidenav: SharedService
    ) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  
  toggleRightSidenav() {
    this.sidenav.toggle();
  }

}

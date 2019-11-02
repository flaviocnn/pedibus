import { Component, OnInit } from '@angular/core';
import { User, Line } from 'src/app/models/daily-stop';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
import { LinesService } from 'src/app/services/lines.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  title = 'Impostazioni';
  user: User;
  lines: Line[] = [];

  constructor(private sidenav: SharedService,
              private userService: UserService,
              private lineService: LinesService

    ) { }

  ngOnInit() {
    this.user = this.userService.mySelf;
    this.lineService.getLines().subscribe( l => {
      this.lines = l;
    });
  }

  toggleRightSidenav() {
    this.sidenav.toggle();
  }

}

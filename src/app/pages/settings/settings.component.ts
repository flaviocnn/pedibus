import { Component, OnInit } from '@angular/core';
import { User, Line, Stop } from 'src/app/models/daily-stop';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
import { LinesService } from 'src/app/services/lines.service';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  title = 'Impostazioni';
  user: User;
  lines: Line[] = [];
  showedStops: Stop[] = [];

  constructor(private sidenav: SharedService,
              private userService: UserService,
              private lineService: LinesService

    ) { }

  ngOnInit() {
    this.user = this.userService.mySelf;
    // se l'utente ha una default stop prendi la linea e le stop associate
    if (this.user.defaultStop) {
      this.lineService.getStopsByLine(this.user.defaultStop.line.name)
      .subscribe(
        stops => {this.showedStops = stops; }
      );
    } else {
      // visualizza le linee disponibili
      this.lineService.getLines().subscribe( l => {
        this.lines = l;
      });
    }
  }

  compareFn(c1: Stop, c2: Stop): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  updateStops(event: MatSelectChange) {
    console.log(event);
    this.lineService.getStopsByLine(event.value.name)
      .subscribe(
        stops => {this.showedStops = stops; }
      );
  }

  updateUser() {
    console.log(this.user);
    this.userService.putUser(this.user).subscribe();
  }

  toggleRightSidenav() {
    this.sidenav.toggle();
  }

}

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
  activeline = null;

  constructor(private sidenav: SharedService,
              private userService: UserService,
              private lineService: LinesService

  ) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.userService.getMySelf().subscribe(u => {
      this.user = u;
      // visualizza le linee disponibili
      this.lines = this.user.administeredLines;
    });
    if(localStorage.getItem('activeLine')){
      this.activeline = JSON.parse(localStorage.getItem('activeLine'));
    }
  }

  compareFn(c1: Stop, c2: Stop): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  compareFn2(c1: Line, c2: Line): boolean {
    return c1 && c2 ? c1.name === c2.name : c1 === c2;
  }

  updateStops(event: MatSelectChange) {
    console.log(event);
    this.lineService.getStopsByLine(event.value.name)
      .subscribe(
        stops => { this.showedStops = stops; }
      );
  }

  updateUser() {
    console.log(this.user);
    localStorage.setItem("activeLine",JSON.stringify(this.activeline));
    this.userService.putUser(this.user).subscribe(() => this.sidenav.openSnackBar('Modifiche salvate'));
  }

  toggleRightSidenav() {
    this.sidenav.toggle();
  }

}

import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { User } from 'src/app/models/daily-stop';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  color = 'accent';
  backgroundColor = 'primary';
  title= 'Gestione Utenti';
  u: User;
  constructor(private sidenav: SharedService) { }

  ngOnInit() {
    this.u = JSON.parse(localStorage.getItem('currentUser'));
  }
  toggleRightSidenav() {
    this.sidenav.toggle();
  }
}

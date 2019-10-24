import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  color = 'accent';
  backgroundColor = 'primary';
  title= 'Gestione Utenti';

  constructor(private sidenav: SharedService) { }

  ngOnInit() {
  }
  toggleRightSidenav() {
    this.sidenav.toggle();
  }
}

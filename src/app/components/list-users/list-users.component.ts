import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {

  users: User[];

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.getAllUsers();
  }

  
  getAllUsers() {
    this.userService.getUsers()
    .subscribe( (data) => {
      this.users = data;
      console.log(this.users);
    });
  }

}

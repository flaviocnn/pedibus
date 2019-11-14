import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User, Line } from 'src/app/models/daily-stop';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {

  users: User[] = [];
  activeLine;

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    if (localStorage.getItem('activeLine')) {
      this.activeLine = JSON.parse(localStorage.getItem('activeLine'));
    } else {
      this.activeLine = this.userService.getMyLine();
    }
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getUsers()
      .subscribe((data) => {
        this.users = data;
        console.log(this.users);
      });
  }

  promuovi(user: User) {
    console.log(user);
    this.openDialog(user, `Vuoi promuovere ${user.firstName} ad admin della linea ${this.userService.getMyLine().name}?`, true);
  }

  declassa(user: User) {
    console.log(user);
    this.openDialog(user, `Vuoi rimuovere ${user.firstName} dalla lista admin della linea ${this.userService.getMyLine().name}?`, false);
  }

  openDialog(u: User, msg: string, promo: boolean): void {
    const line = this.userService.getMyLine();
    const dialogRef = this.dialog.open(PromotionDialog, {
      width: '640px',
      data: { utente: u, messaggio: msg, linea: line, promozione: promo }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        let msg = '';
        if (promo) {
          msg = 'Promozione avvenuta con successo';
        } else {
          msg = 'Rimozione avvenuta con successo';
        }
        this.userService.setLineAdmin(u.id, line, promo).subscribe(
          success => {
            this.sharedService.openSnackBar(msg);
            this.getAllUsers();
          })
      }
    });
  }
  myFilter(user: User) {
    if (user && this.activeLine) {
      if (user.administeredLines) {
        if (user.administeredLines.length > 0) {
          if (user.administeredLines.map(x => x.name).includes(this.activeLine.name)) {
            return true;
          }
        }
      }
    } else{
      return false;
    }

  }

}

export interface PromotionDialogData {
  utente: User;
  messaggio: string;
  linea: Line;
  promozione: boolean;
}

@Component({
  selector: 'promotion-dialog',
  templateUrl: 'promotion-dialog.html',
})
export class PromotionDialog {

  constructor(
    public dialogRef: MatDialogRef<PromotionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: PromotionDialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  conferma() {
    this.dialogRef.close(true);
  }

}

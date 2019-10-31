import { Component, OnInit, Inject } from '@angular/core';
import { NgModel, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ChildrenService } from 'src/app/services/children.service';
import { Child, Stop, Reservation } from 'src/app/models/daily-stop';
import { StopsService } from 'src/app/services/stops.service';
import { UserService } from 'src/app/services/user.service';
import { ReservationsService } from 'src/app/services/reservations.service';

export interface DialogDataReservation {
  date: string;
  isGo: boolean;
  allChildren: Child[],
  allStops: Stop[]
}

@Component({
  selector: 'app-reservation-dialog',
  templateUrl: './reservation-dialog.component.html',
  styleUrls: ['./reservation-dialog.component.scss'],
  providers: [NgModel]
})
export class ReservationDialogComponent {
  title = 'Aggiungi prenotazione';
  nameText: string;
  error: string;
  success: string;
  processing = false;

  children;
  stops;

  selectedChild: Child;
  selectedStop: Stop;

  constructor(
    public dialogRef: MatDialogRef<ReservationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataReservation,
    private ngModel: NgModel,
    private childrenService: ChildrenService,
    private stopService: StopsService,
    private userService: UserService,
    private reservationService: ReservationsService
  ) {
    this.children = data.allChildren;
    this.stops = data.allStops;
  }


  onSubmit(f: NgForm) {
    this.processing = true;
    console.log(f);
    const newRes: Reservation = {
      date: this.data.date,
      isBooked: false,
      isConfirmed: true,
      isGo: this.data.isGo,
      stop: this.selectedStop,
      child: this.selectedChild
    };
    console.log(newRes);
    this.reservationService.postReservation(newRes).subscribe(
      (res) => {
        this.processing = false;
        alert('Prenotazione inserita!');
      },
      (res) => { this.error = res.message; this.processing = false; }
    );

    // this.childrenService.postChild(this.newChild).subscribe(
    //   (child) => {
    //     this.processing = false;
    //     this.error = '';
    //     this.newChild = child;
    //     alert('Child created !');
    //   },
    //   (res) => { this.error = res.error; this.processing = false; },
    // );
  }

  onNoClick(): void {
    // dentro close posso mettere un parametro da portare al padre
    this.dialogRef.close();
  }

}

import { Component, OnInit, ViewChild, AfterViewChecked, Output, EventEmitter, OnDestroy } from '@angular/core';
import { PageEvent, MatPaginator } from '@angular/material';

import { ReservationsService } from '../../services/reservations.service';
import { DatePipe } from '@angular/common';
import { Reservation } from 'src/app/models/daily-stop';
import { UserService } from 'src/app/services/user.service';
import { Subscriber } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';

export interface IHash {
  [id: string]: boolean;
}

@Component({
  selector: 'app-attendees-list',
  templateUrl: './attendees-list.component.html',
  styleUrls: ['./attendees-list.component.scss'],
  providers: [DatePipe]
})

export class AttendeesListComponent implements OnInit, AfterViewChecked {
  title = 'Presenze';
  backgroundColor = 'primary';
  color = 'accent';
  showedRes = [];
  myLine;
  todayDate: Date;
  currentDate: string;
  @ViewChild('paginator', { static: true }) paginator;

  length = 15;
  pageSize = 1;
  pageIndex = 0;
  // MatPaginator Output
  pageEvent: PageEvent;

  constructor(private reservationsService: ReservationsService,
    private userService: UserService,
    public datepipe: DatePipe,
    private sidenav: SharedService
  ) {
  }

  @Output() openNav = new EventEmitter();

  ngOnInit() {
    this.myLine = this.userService.getMyLine();
    this.todayDate = new Date();
    // server date format ddMMyy
    this.currentDate = this.todayDate.toLocaleDateString();

    this.paginator._pageIndex = 7;
    // this.paginator._changePageSize(this.paginator.pageSize);

    this.getReservations(this.todayDate);
  }

  getReservations(date: Date) {
    const latestDate = this.datepipe.transform(date, 'ddMMyy');
    console.log(latestDate);

    this.reservationsService.getDailyStops(latestDate, true)
      .subscribe((data) => {
        data.forEach(dstop => {
          // console.log(dstop.reservations);
          this.showedRes = this.sort(data);
          // dstop.reservations.forEach(res => this.showedRes.push(res));
        });
        console.log(this.showedRes);
      });
  }

  sort(data): any[] {
    data.sort((a, b) => a.timeGo !== b.timeGo ? a.timeGo < b.timeGo ? -1 : 1 : 0);
    data.forEach(el => {
      if (el.reservations) {
        el.reservations.sort((a, b) => {
          a.child.firstName !== b.child.firstName ? a.child.firstName < b.child.firstName ? -1 : 1 : 0;
        });
      }
    });
    return data;
  }

  ngAfterViewChecked() {
    const list = document.getElementsByClassName('mat-paginator-range-label');
    list[0].innerHTML = this.currentDate;
  }

  getPaginatorData(event) {
    const newDate = new Date(this.todayDate.valueOf());
    const numberOfDaysToAdd = parseInt(this.paginator.pageIndex) - 7;

    newDate.setDate(this.todayDate.getDate() + numberOfDaysToAdd);

    // showed on paginator
    this.currentDate = newDate.toLocaleDateString();

    this.getReservations(newDate);

  }

  public checkin(res) {
    const myres = res;
    myres.child.authorities = null;
    myres.child.user.authorities = null;
    myres.stop.line.admins.forEach(element => {
      element.authorities = null;
    });
    if (!myres.isConfirmed) {
      myres.isConfirmed = true;
      this.reservationsService.putReservation(myres);
    }
  }

  toggleRightSidenav() {
    this.sidenav.toggle();
  }
}

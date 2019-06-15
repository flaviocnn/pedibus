import { Component, OnInit, ViewChild, AfterViewChecked, Output, EventEmitter, OnDestroy } from '@angular/core';
import { PageEvent, MatPaginator } from '@angular/material';

import { PedibusService } from '../../services/pedibus.service';
import { DatePipe } from '@angular/common';

export interface IHash {
  [id: string]: boolean;
}

@Component({
  selector: 'app-attendees-list',
  templateUrl: './attendees-list.component.html',
  styleUrls: ['./attendees-list.component.styl'],
  providers: [DatePipe]
})

export class AttendeesListComponent implements OnInit, AfterViewChecked {
  title = 'Attendees';
  showedRes = [];

  todayDate: Date;
  currentDate: string;
  @ViewChild(MatPaginator) paginator;

  length = 15;
  pageSize = 1;
  pageIndex = 0;
  // MatPaginator Output
  pageEvent: PageEvent;

  constructor(private pedibusService: PedibusService,
              public datepipe: DatePipe) {
  }

  @Output() openNav = new EventEmitter();

  ngOnInit() {
    this.todayDate = new Date();
    // server date format ddMMyy
    this.currentDate = this.todayDate.toLocaleDateString();

    this.paginator._pageIndex = 7;
    // this.paginator._changePageSize(this.paginator.pageSize);

    this.getReservations(this.todayDate);
  }

  getReservations(date) {
    let latest_date = this.datepipe.transform(date, 'ddMMyy');
    console.log(latest_date);

    this.pedibusService.getDailyStops(latest_date, 1)
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
      el.reservations.sort((a, b) => a.user.firstName !== b.user.firstName ? a.user.firstName < b.user.firstName ? -1 : 1 : 0);
    });
    return data;
  }

  ngAfterViewChecked() {
    const list = document.getElementsByClassName('mat-paginator-range-label');
    list[0].innerHTML = this.currentDate;
    console.log('ng after view checked');
  }

  getPaginatorData(event) {
    console.log('today is ' + this.todayDate);

    const newDate = new Date(this.todayDate.valueOf());
    const numberOfDaysToAdd = parseInt(this.paginator.pageIndex) - 7;

    console.log(numberOfDaysToAdd);
    newDate.setDate(this.todayDate.getDate() + numberOfDaysToAdd);

    // showed on paginator
    this.currentDate = newDate.toLocaleDateString();
    console.log(this.currentDate);

    this.getReservations(newDate);

  }

  public checkin(res) {
    let myres = res;
    myres.user.authorities = null;
    myres.stop.line.admins.forEach(element => {
      element.authorities = null;
    });
    console.log(myres);
    if (!myres.isConfirmed) {
      myres.isConfirmed = true;
      this.pedibusService.putReservation(myres);
    }
  }

}

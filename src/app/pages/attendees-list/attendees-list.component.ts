import { Component, OnInit, ViewChild, AfterViewChecked, Output, EventEmitter, OnDestroy } from '@angular/core';
import { PageEvent, MatPaginator, MatDialog, MatTabChangeEvent } from '@angular/material';

import { ReservationsService } from '../../services/reservations.service';
import { DatePipe } from '@angular/common';
import { Reservation, DailyStop, Child, Stop, Line } from 'src/app/models/daily-stop';
import { UserService } from 'src/app/services/user.service';
import { Subscriber, Observable } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { first, share } from 'rxjs/operators';
import { ReservationDialogComponent } from 'src/app/components/reservation-dialog/reservation-dialog.component';
import { ChildrenService } from 'src/app/services/children.service';
import { LinesService } from 'src/app/services/lines.service';

export interface IHash {
  [id: string]: boolean;
}

export interface DialogDataReservation {
  date: string;
  isGo: boolean;
  allChildren: Child[];
  allStops: Stop[];
}

@Component({
  selector: 'app-attendees-list',
  templateUrl: './attendees-list.component.html',
  styleUrls: ['./attendees-list.component.scss'],
  providers: [DatePipe]
})

export class AttendeesListComponent implements OnInit, AfterViewChecked, OnDestroy {
  title = 'Presenze';
  backgroundColor = 'primary';
  color = 'accent';
  goReservations$: Observable<DailyStop[]>;
  backReservations$: Observable<DailyStop[]>;
  myLine: Line;
  todayDate: Date;
  currentDate: string;
  latestDate;
  newDate;
  isGoActiveTab = true;
  @ViewChild('paginator', { static: true }) paginator;

  length = 15;
  pageSize = 1;
  pageIndex = 0;
  // MatPaginator Output
  pageEvent: PageEvent;
  reservation$: Observable<Reservation>;
  done = false;
  backToStart = true;

  constructor(private reservationsService: ReservationsService,
              private userService: UserService,
              public datepipe: DatePipe,
              private sidenav: SharedService,
              public dialog: MatDialog,
              private childrenService: ChildrenService,
              private linesService: LinesService
  ) {}

  @Output() openNav = new EventEmitter();

  ngOnDestroy(){
    this.sidenav.closeAttendees();
  }

  ngOnInit() {
    this.sidenav.watchAttendees();
    if(localStorage.getItem('activeLine')){
      this.myLine = JSON.parse(localStorage.getItem('activeLine'));
    } else {
      this.myLine = this.userService.getMyLine();
    }
    this.todayDate = new Date();
    this.newDate = new Date(this.todayDate.valueOf());
    // server date format ddMMyy
    this.currentDate = this.todayDate.toLocaleDateString();

    this.paginator._pageIndex = 7;
    // this.paginator._changePageSize(this.paginator.pageSize);

    this.getReservations(this.todayDate, this.myLine.name);

    this.sidenav.attendees$.subscribe(items=>{
      console.log(items);
      if(items != null){
        this.getReservations(new Date(items), this.myLine.name);
      }
    });

    //this.reservation$ = this.sidenav.attendees$;
  }

  getReservations(date: Date, line: string) {
    this.latestDate = this.datepipe.transform(date, 'ddMMyy');
    console.log(this.latestDate);

    this.goReservations$ = this.reservationsService.getDailyStopsByLine(this.latestDate, true, line);

    this.backReservations$ = this.reservationsService.getDailyStopsByLine(this.latestDate, false, line);
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
    this.newDate = new Date(this.todayDate.valueOf());
    const numberOfDaysToAdd = parseInt(this.paginator.pageIndex) - 7;

    this.newDate.setDate(this.todayDate.getDate() + numberOfDaysToAdd);

    // showed on paginator
    this.currentDate = this.newDate.toLocaleDateString();

    this.getReservations(this.newDate, this.myLine.name);

  }

  public checkin(res, isLast) {
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
    if(isLast){
      this.done = true;
    }
  }

  toggleRightSidenav() {
    this.sidenav.toggle();
  }
  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    console.log(tabChangeEvent);
    if (tabChangeEvent.index == 0) { this.isGoActiveTab = true; }
    else {this.isGoActiveTab = false; }
  }
  openDialog(): void {
    if (this.newDate == null) {
      this.getPaginatorData(null);
    }
    const stopsAndChildren: DialogDataReservation = {
      date: this.newDate.toISOString().slice(0, 10),
      isGo: this.isGoActiveTab,
      allStops: null,
      allChildren: null
    };

    this.linesService
      .getStopsByLine(this.myLine.name)
      .subscribe(el => {
      stopsAndChildren.allStops = el;
      this.childrenService.getAllChildren(this.myLine.id
      ).subscribe(c => {
          stopsAndChildren.allChildren = c;

          const dialogRef = this.dialog.open(ReservationDialogComponent, {
            width: '250px',
            data: stopsAndChildren
          });

          dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            if (result){
              this.getPaginatorData(null);
            }
          });
        });
      }
      );
  }

  postDone(){
    const date = this.datepipe.transform(this.newDate, 'ddMMyy');
    const line = this.myLine.name;
    const isGo = this.isGoActiveTab;
    this.reservationsService.postEndReservation(date,isGo,line)
    .subscribe(()=> {
      if(!this.isGoActiveTab){
        this.backToStart = false;
      } else{ this.done = true };
    });
  }
}

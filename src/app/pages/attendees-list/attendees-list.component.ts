import { Component, OnInit, ViewChild, AfterViewChecked, Output, EventEmitter, OnDestroy } from '@angular/core';
import { PageEvent, MatPaginator } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Line } from '../../models/line';
import { PedibusService } from '../../services/pedibus.service';
import { Observable } from 'rxjs';
import { Reservation } from '../../models/reservation';
import { Stop } from '../../models/stop';
export interface IHash{
  [id:string] : boolean;
}

@Component({
  selector: 'app-attendees-list',
  templateUrl: './attendees-list.component.html',
  styleUrls: ['./attendees-list.component.styl'],
})

export class AttendeesListComponent implements OnInit, AfterViewChecked {
  title = 'Attendees';
  pbLines: Line[] = [];
  goReservations: Reservation[] = [];
  backReservations: Reservation[] = [];
  todayDate: Date;
  currentDate: string;
  @ViewChild(MatPaginator) paginator;

  length = 1;
  pageSize = 1;
  pageIndex = 0;
  // MatPaginator Output
  pageEvent: PageEvent;

  myBackPassengers: IHash = {};
  constructor(private pedibusService: PedibusService) {
  }

  @Output() openNav = new EventEmitter();
  ngOnInit() {
    this.todayDate = new Date();
    this.currentDate = this.todayDate.toLocaleDateString();
    //console.log(this.todayDate);
    this.getLines();
    this.getStops();
    this.paginator._pageIndex = 5;
    //this.paginator._changePageSize(this.paginator.pageSize);
    //this.pbLines$ = this.pedibusService.getPedibus();
  }

  ngAfterViewChecked() {
    const list = document.getElementsByClassName('mat-paginator-range-label');
    // if (this.length>1) {
    //   let index = this.paginator.pageIndex;
    //   console.log(index);
    //   if (this.pbLines[index].path[0].date) {
    //     var cnt = this.pbLines[index].path[0].date.toDateString();
    //   }
    //   list[0].innerHTML = cnt;
    // }
    list[0].innerHTML = this.currentDate;
    console.log("ng after view checked");
  }

  getPaginatorData(event) {
    console.log("today is " + this.todayDate);
    let someDate = new Date(this.todayDate.valueOf());
    let numberOfDaysToAdd = parseInt(this.paginator.pageIndex) - 5;
    console.log(numberOfDaysToAdd);
    someDate.setDate(this.todayDate.getDate() + numberOfDaysToAdd);

    this.currentDate = someDate.toLocaleDateString();
    console.log(this.currentDate);
    // Chiamata a GetStops() 
  }

  getLines(): void {
    this.pedibusService.getLines()
      .subscribe(lines => this.pbLines = lines,
        err => console.error('Observer got an error: ' + err),
        () => this.length = 10);
  }

  getStops() {
    let res = new Reservation();
    res.line = 'A12';
    res.isGo = true;
    res.date = this.currentDate;

    let bres = new Reservation();
    bres.line = 'A12';
    bres.isGo = false;
    bres.date = this.currentDate;

    // Costruiro' l'url sulla base di current data e line name
    this.pedibusService.getStops()
      .subscribe((data) => {
        res.stops = data.slice(0, 3);
        this.goReservations.push(res);
        for (const pass of this.goReservations) {
          
        }

        bres.stops = data.slice(3,data.length);
        this.backReservations.push(bres);
        for (let pass of this.backReservations) {
          for (let stop of pass.stops) {
            for (let pass of stop.passengers) {
              this.myBackPassengers[pass.id] = false;
            }
          }
        }
      });

  }

  public checkin(id) {
    console.log("check in on " + id)
    this.myBackPassengers[id] = 
    !this.myBackPassengers[id];
  }

}

import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Stop, Child, Reservation } from '../../models/daily-stop';
import { StopsService } from '../../services/stops.service';
import { ReservationsService } from '../../services/reservations.service';
import { SharedService } from 'src/app/services/shared.service';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MatSlideToggleChange } from '@angular/material';

@Component({
  selector: 'app-reservations-list',
  templateUrl: './reservations-list.component.html',
  styleUrls: ['./reservations-list.component.scss']
})
export class ReservationsListComponent implements OnInit {

  currDays: string[] = [];
  reservationsGo: Reservation[] = [];
  reservationsBack: Reservation[] = [];
  stops: Stop[];
  labelPosition = 'before';
  disabled = false;
  indeterminate = false;
  checked = false;
  @Output() messageToEmit = new EventEmitter<Reservation[]>();
  @Input() mychild$: Observable<Child>;
  c: Child;

  constructor(
    private stopsService: StopsService,
    private reservationsService: ReservationsService,
    private sidenav: SharedService,
    public datepipe: DatePipe,
  ) { }

  ngOnInit() {

    const todayDate = new Date();
    // server date format ddMMyy
    for (let index = 0; index < 7; index++) {
      const newDate = new Date(todayDate.valueOf());
      newDate.setDate(todayDate.getDate() + index);
      this.currDays.push(newDate.toISOString().slice(0, 10));
    }

    this.getAllStops();
    this.getReservations();

  }

  getReservations() {
    this.mychild$.subscribe(child => {
      this.c = child;
      this.currDays.forEach(d => {
        const day = this.datepipe.transform(d, 'ddMMyy');
        this.reservationsService.getReservation(child.id, day, true)
          .subscribe(res => {
            this.reservationsGo.push(res);
          });
        this.reservationsService.getReservation(child.id, day, false)
          .subscribe(res => {
            this.reservationsBack.push(res);
          });
      });
    });
  }

  getAllStops() {
    this.stopsService.getStops()
      .subscribe((data) => {
        this.stops = data;
      });
  }



  confirmHandler() {
    this.messageToEmit.emit(this.reservationsGo);
  }

  sendReservation(day) {
    this.reservationsService.postReservation(null);
  }

  toggleRightSidenav() {
    this.sidenav.toggle();
  }
  loggo(){
    console.log(this.reservationsGo);
  }
  logback(){
    console.log(this.reservationsBack);
  }

  public toggle(event: MatSlideToggleChange, index, run, day) {
    if (!event.checked) {
      if (run == 'go') {
        this.reservationsGo[index] = null;
      } else if (run == 'back') {
        this.reservationsBack[index] = null;      }
    }
    else if (event.checked && run == 'go') {
      // creo nuova reservation con default stop
      const r: Reservation = {
        date: day,
        isBooked: true,
        stop: this.c.defaultStop,
        child: this.c
      }
      this.reservationsGo[index] = r;
    }
    else if (event.checked && run == 'back') {
      null;
    }
  }
}

import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Stop, Child, Reservation } from '../../models/daily-stop';
import { StopsService } from '../../services/stops.service';
import { ReservationsService } from '../../services/reservations.service';

@Component({
  selector: 'app-reservations-list',
  templateUrl: './reservations-list.component.html',
  styleUrls: ['./reservations-list.component.scss']
})
export class ReservationsListComponent implements OnInit {

  currDays: string[] = [];
  reservationsGo: Reservation[] = [];
  stops: Stop[];
  labelPosition = 'before';
  disabled = false;
  indeterminate = false;
  checked = false;
  @Output() messageToEmit = new EventEmitter<Reservation[]>();
  @Input() child: Child;

  constructor(
    private stopsService: StopsService,
    private reservationsService: ReservationsService,
    ) { }

  ngOnInit() {

    const todayDate = new Date();
    // server date format ddMMyy
    for (let index = 0; index < 7; index++) {
      const newDate = new Date(todayDate.valueOf());
      newDate.setDate(todayDate.getDate() + index);
      this.currDays.push(newDate.toLocaleDateString());
    }

    this.getAllStops();
    this.getReservations();
    this.initDefault();

  }

  getReservations() {
    this.currDays.forEach(day => {
      console.log(day);
      this.reservationsService.getReservations(this.child.id, day)
          .subscribe(res => {
            this.reservationsGo.push(res);
          });
    });
    console.log(this.reservationsGo);
  }

  getAllStops() {
    this.stopsService.getStops()
    .subscribe( (data) => {
      this.stops = data;
    });
  }

  initDefault() {
    if (this.child.defaultStop) {
      this.currDays.forEach(day => {
        this.reservationsGo[day] = this.child.defaultStop;
      });
    }
  }

  confirmHandler() {
    this.messageToEmit.emit(this.reservationsGo);
  }

  setDefault(day) {
    console.log(day);
    console.log(this.child);
    if (this.child.defaultStop) {
      this.reservationsGo[day] = this.child.defaultStop;
    }
    console.log(this.reservationsGo[day]);
  }

  sendReservation(day) {
    this.reservationsService.postReservation(null);
  }
}

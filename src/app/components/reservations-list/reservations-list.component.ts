import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Stop, Child, Reservation } from '../../models/daily-stop';
import { StopsService } from '../../services/stops.service';
import { ReservationsService } from '../../services/reservations.service';
import { SharedService } from 'src/app/services/shared.service';
import { Observable, concat, forkJoin } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MatSlideToggleChange } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

export interface GUIReservation {
  goReservation: Reservation;
  backReservation: Reservation;
}
export interface IHash {
  [date: string]: GUIReservation;
}

@Component({
  selector: 'app-reservations-list',
  templateUrl: './reservations-list.component.html',
  styleUrls: ['./reservations-list.component.scss'],
})
export class ReservationsListComponent implements OnInit {

  currDays: string[] = [];
  reservationsGo: Reservation[] = [];
  reservationsBack: Reservation[] = [];
  stops: Stop[] = [];
  labelPosition = 'before';
  disabled = false;
  indeterminate = false;
  checked = false;
  @Output() messageToEmit = new EventEmitter<Reservation[]>();
  @Input() mychild$: Observable<Child>;
  c: Child;
  dirty = false;

  weekReservations: IHash = {};

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

    //this.getAllStops();
    this.getReservations();

  }

  blankRes(d, isGo, stop) {
    const res: Reservation = {
      id: 0,
      date: d,
      isGo,
      isBooked: true,
      stop,
      child: this.c
    };
    return res;
  }
  compareFn(c1: Stop, c2: Stop): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
  getReservations() {
    this.mychild$.subscribe(child => {
      this.c = child;
      this.currDays.forEach(d => {
        const day = this.datepipe.transform(d, 'ddMMyy');
        let GUIRes: GUIReservation = { goReservation: this.blankRes(d, true, null), backReservation: this.blankRes(d, false, null) };
        this.weekReservations[d] = GUIRes;
        this.reservationsService.getReservation(child.id, day, true)
          .subscribe(res => {
            //this.reservationsGo.push(res);
            // reservation di andata
            if (res) {
              this.weekReservations[d].goReservation = res;
            }

          });
        this.reservationsService.getReservation(child.id, day, false)
          .subscribe(res => {
            //this.reservationsBack.push(res);
            // reservation di ritorno
            if (res) {
              this.weekReservations[d].backReservation = res;
            }

          });
      });
    }, (error) => { },
      () => this.getAllStops());
  }

  getAllStops() {
    this.stopsService.getStops()
      .subscribe((data) => {
        data.forEach(el => {
          this.stops.push(el);
        })
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
  loggo() {
    console.log(this.reservationsGo);
    console.log(this.weekReservations);
  }
  logback() {
    console.log(this.reservationsBack);
  }

  public toggle(event: MatSlideToggleChange, run, day) {
    this.dirty = true;
    if (!event.checked) {
      if (run == 'go') {
        this.weekReservations[day].goReservation.stop = null;
      } else if (run == 'back') {
        this.weekReservations[day].backReservation.stop = null;
      }
    } else {
      if (event.checked && run == 'go') {
        // creo nuova reservation con default stop
        if (this.c.defaultStop != null) {
          this.weekReservations[day].goReservation = this.blankRes(day, true, this.c.defaultStop);
        } else {
          this.weekReservations[day].goReservation = this.blankRes(day, true, this.stops[0]);
        }
      } else if (event.checked && run == 'back') {
        if (this.c.defaultStop != null) {
          this.weekReservations[day].backReservation = this.blankRes(day, false, this.c.defaultStop);
        } else {
          this.weekReservations[day].backReservation = this.blankRes(day, false, this.stops[0]);
        }
      }
    }

  }

  updateAllStop() {
    let updatesList: Observable<any>[] = [];
    console.log(Object.keys(this.weekReservations));
    Object.keys(this.weekReservations).forEach(date => {
      if (this.weekReservations[date].goReservation.id) {
        // c'e' qualcosa
        if (this.weekReservations[date].goReservation.stop) {
          // aggiorna
          const aggiornamento = this.reservationsService.putReservationFromParent(this.weekReservations[date].goReservation);
          updatesList.push(aggiornamento);
        } else {
          // cancella
          const cancellazione = this.reservationsService.deleteReservation(this.weekReservations[date].goReservation.id);
          updatesList.push(cancellazione);
        }
      } else if (this.weekReservations[date].goReservation.stop) {
        // crea
        const inserimento = this.reservationsService.postReservation(this.weekReservations[date].goReservation);
        updatesList.push(inserimento);
      }

      if (this.weekReservations[date].backReservation.id) {
        // c'e' qualcosa
        if (this.weekReservations[date].backReservation.stop) {
          // aggiorna
          const aggiornamento = this.reservationsService.putReservationFromParent(this.weekReservations[date].backReservation);
          updatesList.push(aggiornamento);
        } else {
          // cancella
          const cancellazione = this.reservationsService.deleteReservation(this.weekReservations[date].backReservation.id);
          updatesList.push(cancellazione);
        }
      } else if (this.weekReservations[date].backReservation.stop) {
        // crea
        const inserimento = this.reservationsService.postReservation(this.weekReservations[date].backReservation);
        updatesList.push(inserimento);
      }
    });
    forkJoin(updatesList).subscribe(next => console.log(next), error => console.error(error), () => {
      this.dirty = false;
      this.stops = [];
      this.getReservations();
    });
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
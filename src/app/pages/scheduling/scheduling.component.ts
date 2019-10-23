import { Component, OnInit } from '@angular/core';
import { DatesService } from 'src/app/services/dates.service';
import { UserService } from 'src/app/services/user.service';
import { AvailabilityService } from 'src/app/services/availability.service';
import { Availability, Stop, DailyStop } from 'src/app/models/daily-stop';
import { StopsService } from 'src/app/services/stops.service';

@Component({
  selector: 'app-scheduling',
  templateUrl: './scheduling.component.html',
  styleUrls: ['./scheduling.component.scss']
})
export class SchedulingComponent implements OnInit {
  title = 'Turni'
  datesBE = [];
  datesFE = [];
  selectedDate;
  selectedLine;
  availabilities: Availability[] = [];
  stops: DailyStop[] = [];


  constructor(
    private dateservice: DatesService,
    private userservice: UserService,
    private availService: AvailabilityService,
    private stopsService: StopsService,
    ) { }

  ngOnInit() {
    // ottenere le date - da oggi in avanti di 6 giorni
    this.datesBE = this.dateservice.getWeekArrayBE(new Date());
    this.datesFE = this.dateservice.getWeekArrayFE(new Date());
    // ottenere la linea di competenza
    this.selectedLine = 'Linea_AAA';
    // ottenere le stop(con reservations) della linea
    this.getStops();
    // ottenere le availabilities di (linea, data) per go e back
    this.selectedDate = this.datesBE[0];
    this.getAvailabilities();
  }

  getStops() {
    this.stopsService.getLineStops(this.selectedLine)
    .subscribe(data => {
      this.stops = data;
    });
  }
  getAvailabilities() {
    this.availService.getLinesAvailabilities(this.selectedLine, this.selectedDate, true)
    .subscribe( data => {
      this.availabilities = data;
    });
  }

  toggleClass(stop: DailyStop, i, conf: boolean) {
    if (conf) {this.availabilities[i].assignedStartStop = stop; } else {
      this.availabilities[i].requestedStartStop = stop;
    }

    console.log(this.datesFE);
  }

  selectDay(index) {
    this.selectedDate = this.datesBE[index];
    console.log(this.selectedDate);
    this.getStops();
    this.getAvailabilities();
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatesService } from 'src/app/services/dates.service';
import { UserService } from 'src/app/services/user.service';
import { AvailabilityService } from 'src/app/services/availability.service';
import { Availability, Stop, DailyStop } from 'src/app/models/daily-stop';
import { StopsService } from 'src/app/services/stops.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-scheduling',
  templateUrl: './scheduling.component.html',
  styleUrls: ['./scheduling.component.scss']
})
export class SchedulingComponent implements OnInit, OnDestroy {
  title = 'Turni';
  datesBE = [];
  datesFE = [];
  selectedDate;
  selectedLine;
  availabilities: Availability[] = [];
  backAvailabilities: Availability[] = [];
  stops: DailyStop[] = [];
  backStops: DailyStop[] = [];
  dirty = false;
  selectedFEDate;
  constructor(
    private dateservice: DatesService,
    private userservice: UserService,
    private availService: AvailabilityService,
    private stopsService: StopsService,
    private sidenav: SharedService
  ) { }

  ngOnDestroy(){
    this.sidenav.closeAvailabilities();
  }

  ngOnInit() {
    this.sidenav.watchAvailabilities();
    // ottenere le date - da oggi in avanti di 6 giorni
    this.datesBE = this.dateservice.getWeekArrayBE(new Date());
    this.datesFE = this.dateservice.getWeekArrayFE(new Date());
    // ottenere la linea di competenza
    this.selectedLine = this.userservice.getMyLine().name;
    // ottenere le stop(con reservations) della linea
    this.getStops();
    // ottenere le availabilities di (linea, data) per go e back
    this.selectedDate = this.datesBE[0];
    this.selectedFEDate = this.datesFE[0];
    this.getAvailabilities();
    this.sidenav.availabilities$.subscribe(items=>{
      console.log(items);
      if(items != null){
        this.getAvailabilities();
      }
    });
  }

  getStops() {
    this.stopsService.getSortedLineStops(this.selectedLine, true)
      .subscribe(data => {
        this.stops = data;
      });
    this.stopsService.getSortedLineStops(this.selectedLine, false)
      .subscribe(data => {
        this.backStops = data;
      });
  }
  getAvailabilities() {
    this.availService.getLinesAvailabilities(this.selectedLine, this.selectedDate, true)
      .subscribe(data => {
        this.availabilities = data;
      });
    this.availService.getLinesAvailabilities(this.selectedLine, this.selectedDate, false)
      .subscribe(data => {
        this.backAvailabilities = data;
      });
  }

  toggleClass(stop: DailyStop, i) {
    this.availabilities[i].requestedStop = stop;
    console.log(this.availabilities[i]);
  }
  toggleRightSidenav() {
    this.sidenav.toggle();
  }
  selectDay(index) {
    this.selectedFEDate = this.datesFE[index];
    this.selectedDate = this.datesBE[index];
    console.log(this.selectedDate);
    this.getStops();
    this.getAvailabilities();
  }
  enableSaving(){
    this.dirty = true;
    console.log(this.dirty);
  }

  updateAll(){
    console.log(this.availabilities);
    console.log(this.backAvailabilities);
    this.availabilities.forEach( av =>{
      if (av.isModified && !av.isConfirmed){
        // invia
        console.log(av);
        this.availService.putAvailability(av).subscribe();
      }
    });

    this.backAvailabilities.forEach( av =>{
      if (av.isModified && !av.isConfirmed){
        // invia
        console.log(av);
        this.availService.putAvailability(av).subscribe();
      }
    });
  }

  tipFor(av): string {
    if (av.isModified && av.isConfirmed) { return 'Consolidata'; }
    if (av.isModified) { return 'In attesa di conferma'; }
    return null;
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatesService } from 'src/app/services/dates.service';
import { UserService } from 'src/app/services/user.service';
import { AvailabilityService } from 'src/app/services/availability.service';
import { Availability, Stop, DailyStop } from 'src/app/models/daily-stop';
import { StopsService } from 'src/app/services/stops.service';
import { SharedService } from 'src/app/services/shared.service';
import { ReservationsService } from 'src/app/services/reservations.service';
import { Observable, forkJoin } from 'rxjs';

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
  myLine;
  selectedLine;
  availabilities: Availability[] = [];
  backAvailabilities: Availability[] = [];
  stops: DailyStop[] = [];
  backStops: DailyStop[] = [];
  dirty = false;
  selectedFEDate;
  constructor(
    private dateservice: DatesService,
    private userService: UserService,
    private availService: AvailabilityService,
    private stopsService: StopsService,
    private sidenav: SharedService,
    private reservationsService: ReservationsService
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
    if(localStorage.getItem('activeLine')){
      this.myLine = JSON.parse(localStorage.getItem('activeLine'));
    } else {
      this.myLine = this.userService.getMyLine();
    }
    this.selectedLine = this.myLine.name;
    // ottenere le availabilities di (linea, data) per go e back
    this.selectedDate = this.datesBE[0];
    this.selectedFEDate = this.datesFE[0];
    // ottenere le stop(con reservations) della linea
    this.getStops();
    this.getAvailabilities();
    this.sidenav.availabilities$.subscribe(items=>{
      console.log(items);
      if(items != null){
        this.getAvailabilities();
      }
    });
  }

  getStops() {
    this.reservationsService.getAllDailyStopsByLine(this.selectedDate, true, this.selectedLine).subscribe( (data) =>{
      this.stops = data;
    });
    this.reservationsService.getAllDailyStopsByLine(this.selectedDate, false, this.selectedLine).subscribe( (data) =>{
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
    let updatesList: Observable<any>[] = [];
    this.availabilities.forEach( av =>{
      if (!av.isConfirmed && av.isModified){
        // invia
        console.log(av);
        updatesList.push(this.availService.putAvailability(av));
      }
    });

    this.backAvailabilities.forEach( av =>{
      if (!av.isConfirmed && av.isModified){
        // invia
        console.log(av);
        updatesList.push(this.availService.putAvailability(av));
      }
    });

    forkJoin(updatesList).subscribe((ok)=>{
      this.sidenav.openSnackBar('Modifiche salvate');
    });
  }

  tipFor(av): string {
    if (av.isModified && av.isConfirmed) { return 'Consolidata'; }
    if (av.isModified) { return 'In attesa di conferma'; }
    return null;
  }
}

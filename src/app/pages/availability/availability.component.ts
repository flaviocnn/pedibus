import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { AvailabilityService } from 'src/app/services/availability.service';
import { DatePipe } from '@angular/common';
import { Availability, User } from 'src/app/models/daily-stop';
import { Stop } from 'src/app/models/daily-stop';
import { StopsService } from 'src/app/services/stops.service';
import { DatesService } from 'src/app/services/dates.service';
import { UserService } from 'src/app/services/user.service';
import { MatSelectChange, MatOption, MatSlideToggleChange } from '@angular/material';
import { SharedService } from 'src/app/services/shared.service';
import { post } from 'selenium-webdriver/http';


export interface GUIAvailability {
  id?: number;
  date?: string;
  isConfirmed?: boolean;
  user?: User;
  isModified?: boolean;
  goStop?: Stop;
  backStop?: Stop;
}

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.scss'],
  providers: [DatePipe]
})

export class AvailabilityComponent implements OnInit, OnDestroy {
  title = 'Disponibilità';
  Object = Object;
  myStops: Stop[];
  uid;
  myDefaultStop;
  myLine;
  arrayDate = [];
  springDate = [];

  blankAv: GUIAvailability = {};
  availabilities: Availability[] = [];

  constructor(
    private availabilitiesService: AvailabilityService,
    private stopsService: StopsService,
    private dateService: DatesService,
    private userService: UserService,
    public datepipe: DatePipe,
    private sidenav: SharedService
  ) { }

  ngOnDestroy() {
    this.sidenav.closeScheduling();
  }

  ngOnInit() {
    this.sidenav.watchScheduling();
    this.uid = JSON.parse(localStorage.getItem('currentUser')).id;
    this.myDefaultStop = this.userService.getMyDefaultStop();
    this.arrayDate = this.dateService.getWeekArray(new Date());
    this.arrayDate.forEach(mydate => {
      this.springDate.push(this.datepipe.transform(new Date(mydate), 'ddMMyy'));
    });

    this.getAvails();
    this.getStops();

    this.sidenav.scheduling$.subscribe(items => {
      console.log(items);
      if (items != null) {
        this.getAvails();
      }
    });
  }

  getAvails() {
    this.initBlankAv();
    this.availabilities = [];
    this.springDate.forEach(sdate => {
      // richiedo l' availability di questo user per questa data
      this.availabilitiesService.getUserAvailabilities(this.uid, sdate)
        .subscribe(
          (data) => {
            data.forEach(av => {
              this.availabilities.push(av);
            });
          },
          (error) => { },
          () => {
            this.availabilities.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          }
        );
    });
  }

  getStops() {
    if(localStorage.getItem('activeLine')){
      this.myLine = JSON.parse(localStorage.getItem('activeLine'));
    } else {
      this.myLine = this.userService.getMyLine();
    }
    this.stopsService.getLineStops(this.myLine.name)
      .subscribe(stops => {
        this.myStops = stops;
      });
  }

  compareFn(c1: Stop, c2: Stop): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  showa() {
    console.log(this.availabilities);
  }

  myfilter(s: Stop, av: any) {
    if (av && s.id) {
      return s.id != av;
    }
    return true;
  }

  public toggleChanged(event: MatSlideToggleChange, av: any) {
    // deseleziono il toggle
    if (!event.checked) {
      //   if (run == 'go') {
      //     if (index == -1) {
      //       this.blankAv.goStop = null;
      //       return;
      //     }
      //     this.availabilities[index].goStop = null;
      //   } else {
      //     if (index == -1) {
      //       this.blankAv.backStop = null;
      //       return;
      //     }
      //     this.availabilities[index].backStop = null;
      //   }
      // } else if (event.checked) { // sto attivando il toggle
      //   let selectedStop: Stop;
      //   if (this.myDefaultStop) {
      //     selectedStop = this.myDefaultStop;
      //   } else {
      //     selectedStop = this.myStops[0];
      //   }

      //   if (run == 'go') {
      //     if (index == -1) {
      //       this.blankAv.goStop = selectedStop;
      //       return;
      //     }
      //     this.availabilities[index].goStop = selectedStop;
      //   } else if (run == 'back') {
      //     if (index == -1) {
      //       this.blankAv.backStop = selectedStop;
      //       return;
      //     }
      //     this.availabilities[index].backStop = selectedStop;
      //   }
    }
  }

  confirm(av: Availability) {
    if (av) {
      av.isConfirmed = true;
      this.availabilitiesService.putAvailability(av)
        .subscribe(() => {
          this.sidenav.openSnackBar('Disponibilità confermata');
          this.getAvails();
        });
    }
  }

  update(av: Availability) {
    if (av) {
      this.availabilitiesService.putAvailability(av)
        .subscribe(() => {
          this.sidenav.openSnackBar('Disponibilità aggiornata');
          this.getAvails();
        });
    }
  }

  send(gav: GUIAvailability) {
    var myAvails = [];
    let c = 0;
    if (gav.goStop) {
      const goAv = {
        date: gav.date,
        isGo: true,
        requestedStop: gav.goStop,
        isModified: false
      };
      myAvails.push(goAv);
    }
    if (gav.backStop) {
      const backAv = {
        date: gav.date,
        isGo: false,
        requestedStop: gav.backStop,
        isModified: false
      };
      myAvails.push(backAv);
    }

    myAvails.forEach(element => {
      this.availabilitiesService.postAvailability(element)
        .subscribe(
          (d) => c++,
          (error) => null,
          () => { if (c == myAvails.length) { this.getAvails() } }
        );
    });
  }

  updateDate(e, index) {
    this.availabilities[index].date = e.value;
  }
  toggleRightSidenav() {
    this.sidenav.toggle();
  }

  initBlankAv() {
    let us: User;
    this.userService.getMySelf().subscribe(u => {
      us = u;
      this.blankAv = {
        id: 0,
        date: null,
        isConfirmed: false,
        user: us,
        isModified: false,
        backStop: null,
        goStop: null
      };
    });
  }

  refresh() {
    this.availabilities = [];
    this.getAvails();
  }

}

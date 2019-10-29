import { Component, OnInit } from '@angular/core';
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

export class AvailabilityComponent implements OnInit {
  title = 'Disponibilità';
  availabilities: GUIAvailability[] = [];
  Object = Object;
  myStops: Stop[];
  uid;
  arrayDate = [];
  springDate = [];

  constructor(
    private availabilitiesService: AvailabilityService,
    private stopsService: StopsService,
    private dateService: DatesService,
    private userService: UserService,
    public datepipe: DatePipe,
    private sidenav: SharedService
  ) { }

  ngOnInit() {
    const a = {};
    this.uid = JSON.parse(localStorage.getItem('currentUser')).id;
    this.arrayDate = this.dateService.getWeekArray(new Date());
    this.arrayDate.forEach(mydate => {
      this.springDate.push(this.datepipe.transform(new Date(mydate), 'ddMMyy'));
    });

    this.getAvails();
    this.getStops();
  }

  getAvails() {
    this.availabilities = [];
    this.springDate.forEach(sdate => {
      this.availabilitiesService.getUserAvailabilities(this.uid, sdate)
        .subscribe((data) => {
          data.forEach(av => {
            const newAv: GUIAvailability = {
              id: av.id,
              date: av.date,
              isConfirmed: av.isConfirmed,
              user: av.user,
              isModified: av.isModified,
              backStop: null,
              goStop: null
            };
            if (av.isGo) {
              newAv.goStop = av.requestedStop;
            } else {
              newAv.backStop = av.requestedStop;
            }
            this.availabilities.unshift(newAv);
          });
        });
    });
    const blankAv: GUIAvailability = {
      id: 0,
      date: null,
      isConfirmed: false,
      user: JSON.parse(localStorage.getItem('currentUser')),
      isModified: false,
      backStop: null,
      goStop: null
    };
    this.availabilities.push(blankAv);
  }

  getStops() {
    this.stopsService.getStops()
      .subscribe(stops => {
        this.myStops = stops;
        // console.log(this.myStops);
      });
  }

  onChange(ev: MatSelectChange, av) {
    // const optionText = (ev.source.selected as MatOption);
    // console.log(optionText);
    const idStop = ev.value;

  }

  showa() {
    console.log(this.availabilities);
  }
  compareItems(i1, i2) {
    return i1 && i2 && i1.id === i2.id;
  }

  myfilter(s: Stop, av: any) {
    if (av && s.id) {
      return s.id != av;
    }
    return true;
  }

  public toggle(event: MatSlideToggleChange, index, run) {
    if (!event.checked) {
      null;
    }
  }
  // sendAv(date) {
  //   let go;
  //   let back;
  //   if (this.availabilities[date].go.id != 0) {
  //     go = this.availabilities[date].go;

  //     go.reservations = null;
  //     go.line = null;

  //     const avGo: Availability = {
  //       date,
  //       isGo: true,
  //       requestedStop: go,
  //       isConfirmed: false,
  //       isModified: true
  //     };
  //     this.availabilitiesService.postAvailability(avGo)
  //       .subscribe(x => console.log('go done'));

  //   }
  //   if (this.availabilities[date].back.id != 0) {
  //     back = this.availabilities[date].back;
  //     back.reservations = null;
  //     back.line = null;
  //     const avBack: Availability = {
  //       date,
  //       isGo: false,
  //       requestedStop: back,
  //       isModified: true
  //     };
  //     this.availabilitiesService.postAvailability(avBack)
  //       .subscribe(x => console.log('back done'));
  //   }
  // }
  send(index) {
    if (index != null && this.availabilities[index]) {
      console.log(this.availabilities[index]);

      let goStop;
      let backStop;
      // c'è una avail di andata
      if (this.availabilities[index].goStop) {
        goStop = this.availabilities[index].goStop;
      }
      // c'è una avail di ritorno
      if (this.availabilities[index].backStop) {
        backStop = this.availabilities[index].backStop;
      }
      const newAv: Availability = {
        id: this.availabilities[index].id,
        isConfirmed: this.availabilities[index].isConfirmed,
        isModified: this.availabilities[index].isModified,
        user: this.availabilities[index].user,
        isGo: true,
        date: this.availabilities[index].date,
        requestedStop: null,
      };

      if (this.availabilities[index].id == 0) {
        // crea
        if (goStop) {
          newAv.requestedStop = goStop;
          this.doPost(newAv);
        }
        if (backStop) {
          newAv.requestedStop = backStop;
          this.doPost(newAv);
        }
      } else {
        if (goStop) {
          newAv.requestedStop = goStop;
          this.doUpdate(newAv);
        }
        if (backStop) {
          newAv.requestedStop = backStop;
          this.doUpdate(newAv);
        }
      }
    }
  }
  updateDate(e, index) {
    this.availabilities[index].date = e.value;
  }
  toggleRightSidenav() {
    this.sidenav.toggle();
  }

  doPost(av) {
    console.log('posting...');
    console.log(av);
    this.getAvails();
  }

  doUpdate(av) {
    console.log('updating...');
    console.log(av);
  }
}

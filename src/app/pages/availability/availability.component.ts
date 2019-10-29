import { Component, OnInit } from '@angular/core';
import { AvailabilityService } from 'src/app/services/availability.service';
import { DatePipe } from '@angular/common';
import { Availability } from 'src/app/models/daily-stop';
import { Stop } from 'src/app/models/daily-stop';
import { StopsService } from 'src/app/services/stops.service';
import { DatesService } from 'src/app/services/dates.service';
import { UserService } from 'src/app/services/user.service';
import { MatSelectChange, MatOption, MatSlideToggleChange } from '@angular/material';
import { SharedService } from 'src/app/services/shared.service';


export interface MyAv {
  date?: string;
  confirmed?: boolean;
  go?: Stop;
  back?: Stop;
}

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.scss'],
  providers: [DatePipe]
})

export class AvailabilityComponent implements OnInit {
  title = 'Disponibilità';
  availabilities: MyAv = {};
  Object = Object;
  myStops: Stop[];
  uid;
  arrayDate;
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
    this.uid = JSON.parse(localStorage.getItem("currentUser")).id;
    this.arrayDate = this.dateService.getWeekArray(new Date());
    this.arrayDate.forEach(mydate => {
      this.springDate.push(this.datepipe.transform(new Date(mydate), 'ddMMyy'));
    });

    this.arrayDate.forEach(mydate => {
      if (!this.availabilities[mydate]) {
        a[mydate] = { confirmed: false };
        a[mydate].go = { id: 0 };
        a[mydate].back = { id: 0 };
      }
    });
    this.availabilities = a;
    this.getAvails();
    this.getStops();
  }

  getAvails() {
    const a = {};
    this.springDate.forEach(sdate => {
      this.availabilitiesService.getAvailabilities(this.uid, sdate)
        .subscribe((data) => {
          data.forEach(av => {
            console.log(av);
            if (!a[av.date]) { a[av.date] = {}; }
            a[av.date].confirmed = av.isConfirmed;
            let o = {
                name: av.requestedStop.name,
                id: av.requestedStop.id
              };
            if (av.isGo) {
              a[av.date].go = o;
              a[av.date].back = { id: 0 };
            } else {
              a[av.date].back = o;
              a[av.date].go = { id: 0 };
            }
          });
          this.Object.keys(a).forEach(data=>{
            this.availabilities[data] = a[data];
          });
        });
    });
  }

  getStops() {
    this.stopsService.getStops()
      .subscribe(stops => {
        this.myStops = stops;
        //console.log(this.myStops);
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

  public toggle(event: MatSlideToggleChange, obj, run) {
    if (!event.checked) {
      if (run == 'go') {
        this.availabilities[obj].go = { id: 0 };
      } else if (run == 'back') {
        this.availabilities[obj].back = { id: 0 };
      }
    }
    else if (event.checked && run == 'go') {
      if (this.availabilities[obj].go.id == 0) {
        this.availabilities[obj].go = this.myStops[0];
      }
    }
    else if (event.checked && run == 'back') {
      if (this.availabilities[obj].back.id == 0) {
        this.availabilities[obj].back = this.myStops[0];
      }
    }
  }

  sendAv(date) {
    let go;
    let back;
    if (this.availabilities[date].go.id != 0) {
      go = this.availabilities[date].go;

      go.reservations = null;
      go.line = null;

      const avGo: Availability = {
        date: date,
        isGo: true,
        requestedStop: go,
        isConfirmed: false,
        isModified: true
      };
      this.availabilitiesService.postAvailability(avGo)
        .subscribe(x => console.log('go done'));

    }
    if (this.availabilities[date].back.id != 0) {
      back = this.availabilities[date].back;
      back.reservations = null;
      back.line = null;
      const avBack: Availability = {
        date: date,
        isGo: false,
        requestedStop: back,
        isModified: true
      };
      this.availabilitiesService.postAvailability(avBack)
        .subscribe(x => console.log('back done'));
    }


  }
  toggleRightSidenav() {
    this.sidenav.toggle();
  }
}

import { Component, OnInit } from '@angular/core';
import { AvailabilityService } from 'src/app/services/availability.service';
import { DatePipe } from '@angular/common';
import { Availability } from 'src/app/models/daily-stop';
import { Stop } from 'src/app/models/daily-stop';
import { StopsService } from 'src/app/services/stops.service';
import { DatesService } from 'src/app/services/dates.service';
import { UserService } from 'src/app/services/user.service';
import { MatSelectChange, MatOption } from '@angular/material';


export interface MyAv {
  date?: string;
  confirmed?: boolean;
  go?: Stop;
  back?: Stop;
}

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.styl'],
  providers: [DatePipe]
})

export class AvailabilityComponent implements OnInit {

  availabilities: MyAv;
  Object = Object;
  myStops: Stop[];

  constructor(
    private availabilitiesService: AvailabilityService,
    private stopsService: StopsService,
    private dateService: DatesService,
    private userService: UserService,
    public datepipe: DatePipe
  ) { }

  ngOnInit() {
    this.getAvails();
    this.getStops();
  }

  getAvails() {
    const d = this.datepipe.transform(new Date(), 'ddMMyy');
    const uid = this.userService.getMyId();
    this.availabilitiesService.getAvailabilities(uid, d)
      .subscribe((data) => {
        const a = {};
        data.forEach(av => {
          if (!a[av.date]) { a[av.date] = {}; }
          a[av.date].confirmed = av.isConfirmed;
          let o;
          if (av.isConfirmed) {
            o = {
              name: av.assignedStartStop.name,
              id: av.assignedStartStop.id
            };
          } else {
            o = {
              name: av.requestedStartStop.name,
              id: av.requestedStartStop.id
            };
          }
          if (av.isGo) {
            a[av.date].go = o;
          } else {
            a[av.date].back = o;
          }
        });
        this.dateService.getWeekArray(new Date())
          .forEach(x => {
            if ( !a[x]) {
              a[x] = { confirmed: false };
              a[x].go = {id: 0};
              a[x].back = {id: 0};
            }
          });
        this.availabilities = a;
      });
  }

  getStops() {
    this.stopsService.getStops()
      .subscribe(stops => {
        this.myStops = stops;
        console.log(this.myStops);
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

  myfilter(s: Stop, av: any){
    if(av && s.id){
      return s.id != av;
    }
    return true;
  }
}

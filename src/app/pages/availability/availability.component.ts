import { Component, OnInit } from '@angular/core';
import { AvailabilityService } from 'src/app/services/availability.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.styl'],
  providers: [DatePipe]
})
export class AvailabilityComponent implements OnInit {

  currDays: string[] = [];

  constructor(
    private availabilitiesService: AvailabilityService,
    public datepipe: DatePipe
  ) { }

  ngOnInit() {
    const todayDate = new Date();
    // server date format ddMMyy
    for (let index = 0; index < 7; index++) {
      const newDate = new Date(todayDate.valueOf());
      newDate.setDate(todayDate.getDate() + index);
      this.currDays.push(newDate.toLocaleDateString());
    }

    //this.currDays.forEach(day => )
    this.getAvails();
  }

  getAvails() {
    const d = this.datepipe.transform(new Date(), 'ddMMyy');
    const uid = localStorage.getItem('user_id');
    this.availabilitiesService.getAvailabilities(uid, d )
    .subscribe((data) => {
      data.forEach(av => {
        //
        console.log(av);
      });
    });
  }

}

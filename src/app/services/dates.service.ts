import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DatesService {

  constructor(private datepipe: DatePipe) { }

  getWeekArray(startingDay: Date): string[] {
    const currDays = [];
    // server date format ddMMyy
    for (let index = 0; index < 7; index++) {
      const newDate = new Date(startingDay.valueOf());
      newDate.setDate(startingDay.getDate() + index);
      // yyyy-mm-dd
      currDays.push(newDate.toISOString().slice(0, 10));
    }
    return currDays;
  }

  getWeekArrayBE(startingDay: Date): string[] {
    const currDays = [];
    // server date format ddMMyy
    for (let index = 0; index < 7; index++) {
      const newDate = new Date(startingDay.valueOf());
      newDate.setDate(startingDay.getDate() + index);
      currDays.push(this.datepipe.transform(newDate, 'ddMMyy'));
    }
    return currDays;
  }

  getWeekArrayFE(startingDay: Date): string[] {
    const currDays = [];
    // server date format ddMMyy
    for (let index = 0; index < 7; index++) {
      const newDate = new Date(startingDay.valueOf());
      newDate.setDate(startingDay.getDate() + index);
      currDays.push(this.datepipe.transform(newDate, 'dd/MM/yy'));
    }
    return currDays;
  }

}

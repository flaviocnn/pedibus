import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatesService {

  constructor() { }

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

}

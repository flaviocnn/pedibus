import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scheduling',
  templateUrl: './scheduling.component.html',
  styleUrls: ['./scheduling.component.scss']
})
export class SchedulingComponent implements OnInit {
  items = [false,false,false, false, false, false];
  constructor() { }

  ngOnInit() {
  }
  toggleClass(index){
    this.items = this.items.map(i =>  i = false);
    this.items[index] = true;
    console.log(this.items);
  }

}

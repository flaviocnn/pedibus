import { Component, OnInit } from '@angular/core';
import { Child } from '../../models/daily-stop';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ChildrenService } from '../../services/children.service';
import { ReservationsService } from '../../services/reservations.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-my-child',
  templateUrl: './my-child.component.html',
  styleUrls: ['./my-child.component.scss']
})
export class MyChildComponent implements OnInit {
  mychild$ : Observable<Child> = null;
  currentChild: Child;
  constructor(
    private route: ActivatedRoute,
    private childrenService: ChildrenService,
    private location: Location,
    private reservationService: ReservationsService,
    ) { }

  ngOnInit() {
    this.getChild();
  }

  getChild(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.mychild$ = this.childrenService.getChild(id);
    }

  goBack(): void {
    this.location.back();
  }

  getReservations() {
    //this.reservationService.getDailyStops()
  }

  getMessage(message) {
    console.log(message);
  }

}

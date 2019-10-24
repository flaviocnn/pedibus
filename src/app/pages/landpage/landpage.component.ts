import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-landpage',
  templateUrl: './landpage.component.html',
  styleUrls: ['./landpage.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate('1s 0.1s ease-in-out')
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class LandpageComponent implements OnInit {
  title = 'Pedibus';
  state: String = 'inactive';

  constructor(private sidenav: SharedService) { }

  ngOnInit() {
    this.toggleRightSidenav();
  }


  toggleRightSidenav() {
    this.sidenav.toggle();
  }
}

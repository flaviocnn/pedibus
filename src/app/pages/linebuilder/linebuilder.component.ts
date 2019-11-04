import { Component, OnInit } from '@angular/core';
import { JSONLine, Admin, Stop } from 'src/app/models/daily-stop';
import { SharedService } from 'src/app/services/shared.service';
import { LinesService } from 'src/app/services/lines.service';


@Component({
  selector: 'app-linebuilder',
  templateUrl: './linebuilder.component.html',
  styleUrls: ['./linebuilder.component.scss']
})
export class LinebuilderComponent implements OnInit {
  title = 'Carica Linea';
  nomeLinea = 'Nuova Linea';
  lat = 45.0713;
  lng = 7.6661;
  notReady = true;
  origin = {};
  destination = {};
  waypoints = [];
  public travelMode = 'WALKING';
  selectedFile: File;
  admins: Admin[];
  stops: Stop[];
  lineUploaded: JSONLine = null;

  constructor(
    private sidenav: SharedService,
    private lineService: LinesService) { }

  ngOnInit() {
  }
  toggleRightSidenav() {
    this.sidenav.toggle();
  }
  onFileChanged(event) {
    const inputNode: any = document.querySelector('#file');
    this.selectedFile = inputNode.files[0];
    if (typeof (FileReader) !== 'undefined') {
      const fileReader = new FileReader();
      fileReader.readAsText(this.selectedFile, 'UTF-8');
      fileReader.onload = () => {
        this.lineUploaded = JSON.parse(fileReader.result as string) as JSONLine;
        this.stops = this.lineUploaded.stops;
        this.admins = this.lineUploaded.admins;
        //console.log(this.stops);
        //console.log(this.admins);
      };
      fileReader.onerror = (error) => {
        console.log(error);
      };
    }
  }

  onUpload() {
    this.stops.forEach((el, i) => {
      const point = { lat: +el.latitude, lng: +el.longitude };
      if (i == 0) {
        this.origin = point;
      }
      else if (i == (this.stops.length - 1)) {
        this.destination = point;
      } else{
        this.waypoints.push({location: point});
      }
    });
    this.notReady = false;

    //console.log(this.origin);
    //console.log(this.destination);
    //console.log(this.waypoints);
    console.log(this.stops);
    console.log(this.admins);
    this.lineUploaded.name = this.nomeLinea;
    console.log(this.lineUploaded);
    this.lineService.postLine(this.lineUploaded)
    .subscribe();

    // TO-DO:
    // postare this.uploadedLine sul server
  }
}

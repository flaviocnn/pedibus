import { Component, OnInit, Inject } from '@angular/core';
import { ChildrenService } from '../../services/children.service';
import { StopsService } from '../../services/stops.service';
import { Stop, Child } from '../../models/daily-stop';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, NgModel, NgForm } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';

export interface IHash {
  [id: number]: number;
}

export interface DialogData {
  first_name: string;
  last_name: string;
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  providers: [NgModel],
})
export class DialogOverviewExampleDialog {
  title = 'Dashboard Genitore';
  nameText: string;
  error: string;
  success: string;
  processing = false;
  firstName: string;
  lastName: string;
  newChild: Child;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    private ngModel: NgModel,
    private childrenService: ChildrenService,
  ) { }

  onSubmit(f: NgForm) {
    this.processing = true;
    console.log(f);
    this.newChild = {
      firstName: f.value.name,
      lastName: f.value.lastname,
      id: null,
      parent: null,
    };
    console.log(this.newChild);
    this.childrenService.postChild(this.newChild).subscribe(
      (child) => {
        this.processing = false;
        this.error = '';
        this.newChild = child;
        alert('Child created !');
      },
      (res) => { this.error = res.error; this.processing = false; },
    );
  }

  onNoClick(): void {
    this.dialogRef.close(this.newChild);
  }

}

@Component({
  selector: 'app-parent-dashboard',
  templateUrl: './parent-dashboard.component.html',
  styleUrls: ['./parent-dashboard.component.scss'],
})
export class ParentDashboardComponent implements OnInit {

  constructor(private childrenService: ChildrenService,
              private stopsService: StopsService,
              public dialog: MatDialog,
              private sidenav: SharedService) { }

  title = 'Dashboard Genitori';
  stopList: Stop[] = [];
  myChildren: Child[] = [];
  defaultStops: IHash = {};
  name: string;
  surname: string;
  dirty = false;

  ngOnInit() {
    this.getMyChildren();
    this.getAllStops();
  }

  getMyChildren() {
    this.childrenService.getMyChildren()
      .subscribe((data) => {
        this.myChildren = data;
        data.forEach(child => {
          if (child.defaultStop) {
            this.defaultStops[child.id] = +child.defaultStop.id;
          }
        });
      });
  }

  getAllStops() {
    this.stopsService.getStops()
      .subscribe((data) => {
        this.stopList = data;
      });
  }

  addNewChild(child: Child) {
    this.childrenService.postChild(child);
  }

  changeStop(event) {
    console.log(this.defaultStops);
    this.dirty = true;
  }

  updateAllStop() {
    Object.keys(this.defaultStops).forEach((key) => {
      this.childrenService.updateDefaultStop(+key, this.defaultStops[key]);
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // let newchild: Child = result;
      if (result) {
        this.myChildren.push(result);
      }

    });
  }

  toggleRightSidenav() {
    this.sidenav.toggle();
  }

}


import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, NgModel, NgForm, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CreateAccountService } from 'src/app/services/create-account.service';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Child } from 'src/app/models/daily-stop';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.scss'],
  providers: [NgModel]
})
export class InviteUserComponent implements OnInit {

  emailText: string;
  error: string;
  success: string;
  processing = false;
  userForm;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  fruits: Child[] = [];

  onSubmit(formData) {
    this.processing = true;
    console.warn(formData);
    // this.createAccountService.createAccount(f.form.value.email).subscribe(
    //   () => {this.processing = false; this.error = ''; alert('Account created !'); },
    //   (res) => { this.error = res.error; this.processing = false; },
    // );
    this.openSnackBar();
  }

  constructor(private ngModel: NgModel, 
    private formBuilder: FormBuilder,
    private createAccountService: CreateAccountService,
    private _snackBar: MatSnackBar) {
      this.userForm = this.formBuilder.group({
        firstName: '',
        surname: '',
        email: ''
      });
     }

  ngOnInit() {
  }

  openSnackBar() {
    this._snackBar.open("L'utente riceverà una email di conferma per validare il suo account.", '', {
      duration: 5000,
    });
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push({firstName: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: Child): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

}

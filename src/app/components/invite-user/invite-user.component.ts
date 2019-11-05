import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, NgModel, NgForm, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CreateAccountService } from 'src/app/services/create-account.service';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Child, User } from 'src/app/models/daily-stop';
import { MatSnackBar } from '@angular/material';
import { UserService } from 'src/app/services/user.service';

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

  constructor(
    private ngModel: NgModel, 
    private formBuilder: FormBuilder,
    private createAccountService: CreateAccountService,
    private userService: UserService,
    private _snackBar: MatSnackBar) {
      this.userForm = this.formBuilder.group({
        firstName: '',
        surname: '',
        email: ''
      });
     }

  ngOnInit() {
  }

  onSubmit(formData) {
    this.processing = true;
    console.warn(formData);
    console.log(this.fruits);
    // this.createAccountService.createAccount(f.form.value.email).subscribe(
    //   () => {this.processing = false; this.error = ''; alert('Account created !'); },
    //   (res) => { this.error = res.error; this.processing = false; },
    // );
    const newUser: User = {
      firstName: formData.firstName,
      lastName: formData.surname,
      username: formData.email,
      children: this.fruits,
    };
    this.userService.postNewUser(newUser).subscribe(
      () => {this.processing = false; this.error = ''; this.openSnackBar(); },
      (res) => { this.error = res.error; this.processing = false; },
    );
  }

  openSnackBar() {
    this._snackBar.open(`L'utente riceverà un'email di conferma per validare il suo account.`, 'Ok', {
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

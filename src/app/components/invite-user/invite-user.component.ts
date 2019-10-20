import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, NgModel, NgForm } from '@angular/forms';
import { CreateAccountService } from 'src/app/services/create-account.service';

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

  onSubmit(f: NgForm) {
    this.processing = true;
    this.createAccountService.createAccount(f.form.value.email).subscribe(
      () => {this.processing = false; this.error = ''; alert('Account created !'); },
      (res) => { this.error = res.error; this.processing = false; },
    );
  }

  constructor(private ngModel: NgModel, private createAccountService: CreateAccountService) { }

  ngOnInit() {
  }

}

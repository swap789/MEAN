import { Component } from "@angular/core";
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: "sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ['./sign-up.component.css']
})

export class SignUpComponent {
  isLoading: boolean = false;

  constructor(private authService: AuthService) {

  }
  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.authService.createUser(form.value.email, form.value.password)
      .subscribe(result => {
        console.log(result);
      }, error => {
        alert('Error from Server');
      })
  }
}


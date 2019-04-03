import { Component } from "@angular/core";
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: "sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ['./sign-up.component.css']
})

export class SignUpComponent {
  isLoading: boolean = false;

  constructor(private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar) {
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password)
      .subscribe(result => {
        console.log(result);
        this.isLoading = false;
        this.openSnackBar("You are sign up Successfully", "Success");
        this.router.navigate(['/login']);
      }, error => {
        this.isLoading = false;
        this.openSnackBar("User already exist", "Error");
      })
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }
}


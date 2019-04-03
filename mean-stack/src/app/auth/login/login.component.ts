import { Component } from "@angular/core";
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { BroadcasterService } from 'src/app/post/broadcast.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: "user-login",
  templateUrl: "./login.component.html",
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  isLoading: boolean = false;
  tokenTimer: any;
  constructor(private authService: AuthService,
    private broadcastService: BroadcasterService,
    private router: Router,
    private snackBar: MatSnackBar) { }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password)
      .subscribe(result => {
        this.authService.authToken = result.token;
        const token = result.token;
        const expiresIn = result.expiresIn;
        const userId = result.userId;
        this.authService.setUserId = userId;

        console.log(result);
        this.authService.setAuthTimer(expiresIn);
        const now = new Date();
        const expiration = new Date(now.getTime() + expiresIn * 1000);
        this.authService.saveAuthData(token, expiration, userId);
        this.authService.isAuth = true;
        this.broadcastService.broadcast("isAuthenticated", true);
        this.isLoading = false;
        this.openSnackBar("You are logged in Successfully", "Success");
        this.router.navigate(['/']);
      }, error => {
        this.isLoading = false;
        this.openSnackBar("You are unauthorized", "Error");
      })
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }
}



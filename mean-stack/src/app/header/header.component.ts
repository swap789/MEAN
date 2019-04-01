import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { BroadcasterService } from '../post/broadcast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isAuthenticated: boolean = false;
  constructor(private broadcastService: BroadcasterService,
    private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuth;
    console.log(this.isAuthenticated);
    this.broadcastService.on("isAuthenticated").subscribe((isAuthenticated: boolean) => {
      this.isAuthenticated = isAuthenticated;
    })
  }

  onLogout() {
    this.isAuthenticated = false;
    this.authService.onLogout();
  }
}

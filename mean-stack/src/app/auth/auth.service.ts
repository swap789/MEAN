import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { AuthData } from './auth-data.model';
import { Router } from '@angular/router';
import { BroadcasterService } from '../post/broadcast.service';

@Injectable({ providedIn: "root" })
export class AuthService {

    private token: string;
    private isAuthenticated: boolean = false;
    private tokenTimer: any;
    private userId: string;

    constructor(private http: HttpClient,
        private router: Router,
        private broadcastService: BroadcasterService) {
    }

    get authToken() {
        return this.token;
    }

    set authToken(token: string) {
        this.token = token;
    }

    get isAuth() {
        return this.isAuthenticated;
    }

    set isAuth(isAuth: boolean) {
        this.isAuthenticated = isAuth;
    }

    get getUserId() {
        return this.userId;
    }

    set setUserId(userId: string) {
        this.userId = userId;
    }

    createUser(email: string, password: string): Observable<any> {
        const authData: AuthData = { email: email, password: password }
        return this.http.post("http://localhost:3000/api/user/signup", authData);
    }

    login(email: string, password: string): Observable<any> {
        const authData: AuthData = { email: email, password: password }
        return this.http.post("http://localhost:3000/api/user/login", authData);
    }

    autoAuthUser() {
        const authInfo = this.getAuthData();
        if (!authInfo) {
            return;
        }
        const now = new Date();
        const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
            this.authToken = authInfo.token;
            this.isAuth = true;
            this.userId = authInfo.userId;
            this.setAuthTimer(expiresIn / 1000);
            this.broadcastService.broadcast("isAuthenticated", true);
        }
    }

    setAuthTimer(duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.onLogout();
        }, duration * 1000);
    }

    saveAuthData(token: string, expriration: Date, userId: string) {
        localStorage.setItem("token", token);
        localStorage.setItem("expriration", expriration.toISOString());
        localStorage.setItem("userId", userId);
    }

    clearAuthData() {
        localStorage.removeItem("token");
        localStorage.removeItem("expriration");
        localStorage.removeItem("userId");
    }

    getAuthData() {
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expriration");
        const userId = localStorage.getItem("userId");
        if (!token || !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId
        }
    }

    onLogout() {
        this.broadcastService.broadcast("isAuthenticated", false);
        this.authToken = null;
        this.isAuth = false;
        this.userId = null;
        this.clearAuthData();
        clearTimeout(this.tokenTimer);
        this.router.navigate(['/']);
    }
}
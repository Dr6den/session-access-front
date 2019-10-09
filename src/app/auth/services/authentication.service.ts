import { Injectable, InjectionToken, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalService } from "../../global.service";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private url:string;
    
    constructor(private http: HttpClient, private globalService:GlobalService) {
        this.url = globalService.REST_URL;
    }
    
    authUser(username: string, password: string): Observable<any> {
        let authUrl = this.url + "/AuthUser";
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.set("Content-Type", "application/json");
        headers = headers.set("Authorization", username + ":" + password);
        return this.globalService.sendRequest<any>("POST", authUrl, null, null, headers);
    } 
    
    refreshToken(): void {
        let authToken = JSON.parse(localStorage.getItem('currentUser'));
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.set("Authorization", authToken.refresh_token);

        let url = this.url + "/RefreshToken";
        this.globalService.sendRequest<any>("GET", url, null, null, headers).subscribe((user) => { 
            if (user && user.access_token) {
                localStorage.setItem('currentUser', JSON.stringify(user));
            }
        },
        error => {
            this.logout();
        });
    }
       
    login(username: string, password: string) {  
        return this.authUser(username, password)
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.access_token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
                return user;
            })); 
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}
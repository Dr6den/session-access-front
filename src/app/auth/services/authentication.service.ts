import { Injectable, InjectionToken, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
        let authUrl = this.url + "/AuthUser?username=" + username + "&password=" + password;
        return this.globalService.sendRequest<any>("GET", authUrl);
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
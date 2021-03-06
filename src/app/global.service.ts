import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Injectable } from "@angular/core";

@Injectable({providedIn:"root"})
export class GlobalService {
    constructor(private http: HttpClient){}
    
    public REST_URL: string = `http://localhost:4502/api`;

    public sendRequest<T>(verb: string, url: string, body?: Object, params?: HttpParams, headersPar?: HttpHeaders,
            responseType?: string, withoutContentType?: boolean) : Observable<T> {
        let myHeaders = new HttpHeaders();
        let resType = (responseType) ? responseType : "json"; 
        
        let authToken = JSON.parse(localStorage.getItem('currentUser'));
        if (authToken) {
            if(!withoutContentType) {
                myHeaders = myHeaders.set("Content-Type", "application/json");
            }
            myHeaders = myHeaders.set("Authorization", authToken.access_token);
        }
        if (headersPar) {
            myHeaders = headersPar;
        }

        return this.http.request<T>(verb, url, {
            body: body,
            headers: myHeaders,
            params: params,
            responseType: resType as 'json'
        }).pipe(catchError(err => {
            return throwError(err)}));
    }    
}



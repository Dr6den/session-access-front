import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Injectable } from "@angular/core";

@Injectable({providedIn:"root"})
export class GlobalService {
    constructor(private http: HttpClient){}
    
    public REST_URL: string = `http://localhost:4501/api`;
    
    public sendRequest<T>(verb: string, url: string, body?: Object) : Observable<T> {
        let myHeaders = new HttpHeaders();
        
        let authToken = JSON.parse(localStorage.getItem('currentUser'));
        if (authToken) {
            myHeaders = myHeaders.set("Content-Type", "application/json");
            myHeaders = myHeaders.set("Authorization", authToken.access_token);
        }
         /*if(verb == "PUT") {
		myHeaders = myHeaders.set("Access-Control-Allow-Origin","*");        
		myHeaders = myHeaders.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, DELETE");
		myHeaders = myHeaders.set("Access-Key", "<secret>");
		myHeaders = myHeaders.set("Application-Names", ["exampleApp", "pro"]);        
        }*/
        return this.http.request<T>(verb, url, {
            body: body,
            headers: myHeaders
        }).pipe(catchError(err => {
            return throwError(err.status)}));
        }
}



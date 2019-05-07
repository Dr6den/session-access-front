import { Injectable, Inject, InjectionToken } from "@angular/core";
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Role } from "../model/role.model";

export const REST_URL = new InjectionToken("rest_url");

@Injectable()
export class RestDataSource {
    constructor(private http: HttpClient,
        @Inject(REST_URL) private url: string) { }
        
    getRoles(): Observable<Role> {
        let url = this.url + "/getRoles";
        return this.sendRequest<Role>("GET", url);
    }
    
    saveRole(role: Role): Observable<Role> {
	let url = this.url + "/saveRole";
        return this.sendRequest<Role>("POST", url, role);
    }

    private sendRequest<T>(verb: string, url: string, body?: Object)
        : Observable<T> {

        let myHeaders = new HttpHeaders();
	if(verb == "POST") {
		myHeaders = myHeaders.set("Access-Control-Allow-Origin","*");
		myHeaders = myHeaders.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, DELETE");
		myHeaders = myHeaders.set("Access-Key", "<secret>");
		myHeaders = myHeaders.set("Application-Names", ["exampleApp", "pro"]);        
        }
        return this.http.request<T>(verb, url, {
            body: body,
            headers: myHeaders
        }).pipe(catchError((error: Response) => 
            throwError(`Network Error: ${error.statusText} (${error.status})`)));
        }

}

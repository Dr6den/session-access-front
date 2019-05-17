import { Injectable, Inject, InjectionToken } from "@angular/core";
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Role } from "../model/role.model";
import { User } from "../model/user.model";

export const REST_URL = new InjectionToken("rest_url");

@Injectable()
export class RestDataSource {
    constructor(private http: HttpClient,
        @Inject(REST_URL) private url: string) { }
        
    getRole(): Observable<Role> {
        let url = this.url + "/angular/getRoles";
        return this.sendRequest<Role>("GET", url);
    }
    
    getRoles(): Observable<Role[]> {
        let url = this.url + "/GetRecords/Roles";
        return this.sendRequest<Role[]>("GET", url);
    }
    
    saveRole(role: Role): Observable<Role> {
	let url = this.url + "/InsertRecord/Roles";
        return this.sendRequest<Role>("POST", url, role);
    }
    
    getUser(): Observable<User> {
        let url = this.url + "/getADDate";
        return this.sendRequest<User>("GET", url);
    }
    
    getUsers(): Observable<User[]> {
        let url = this.url + "/GetRecords/Users";
        return this.sendRequest<User[]>("GET", url);
    }
    
    saveUser(user: User): Observable<User> {
	let url = this.url + "/InsertRecord/Users";
        return this.sendRequest<User>("POST", url, user);
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

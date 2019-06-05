import { Injectable, Inject, InjectionToken } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
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
        let url = this.url + "/getRole";
        return this.sendRequest<Role>("GET", url);
    }
    
    getRoles(): Observable<Role[]> {
        let url = this.url + "/getRoles";
        return this.sendRequest<Role[]>("GET", url);
    }
    
    saveRole(role: Role): Observable<Role> {
	let url = this.url + "/saveRole";
        return this.sendRequest<Role>("POST", url, role);
    }
    
    getUser(username: string): Observable<User> {
        let params = new HttpParams();
        params = params.append('username', username);

        let url = this.url + "/getUser";
        return this.http.get(url, {params: params});
    }
    
    getUsers(): Observable<User[]> {
        let url = this.url + "/getUsers";
        return this.sendRequest<User[]>("GET", url);
    }
    
    saveUser(user: User): Observable<User> {
	let url = this.url + "/saveUser";
        return this.sendRequest<User>("POST", url, user);
    }

    private sendRequest<T>(verb: string, url: string, body?: Object)
        : Observable<T> {

        let myHeaders = new HttpHeaders();
        console.log("" + myHeaders.keys() );
	
        if(verb == "PUT") {
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

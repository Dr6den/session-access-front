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
        let url = this.url + "/angular/getRoles";
        return this.sendRequest<Role>("GET", url);
    }
    
    getRoles(): Observable<Role[]> {
        let url = this.url + "/GetRecords/Roles?parseRoleOpts=true";
        return this.sendRequest<Role[]>("GET", url);
    }
    
    insertRole(role: Role): Observable<Role> {
	let url = this.url + "/InsertRecord/Roles";
        return this.sendRequest<Role>("POST", url, role);
    }
    
    updateRole(role: Role): Observable<Role> {
	let url = this.url + "/UpdatetRecord/Roles";
        return this.sendRequest<Role>("POST", url, role);
    }
    
    getUser(username: string): Observable<User> {
        let params = new HttpParams();
        params = params.append('username', username);

        let url = this.url + "/GetUserInfo";
        return this.http.get(url, {params: params});
    }
    
    getUsers(): Observable<User[]> {
        let url = this.url + "/GetRecords/Users";
        return this.sendRequest<User[]>("GET", url);
    }
    
    insertUser(user: User): Observable<User> {
	let url = this.url + "/InsertRecord/Users";
        return this.sendRequest<User>("POST", url, user);
    }
    
    updateUser(user: User): Observable<User> {
	let url = this.url + "/UpdateRecord/Users";     
        return this.sendRequest<User>("POST", url, user);
    }
    
    deleteUser(userName: string): Observable<string> {
	let url = this.url + "/deleteUser/" + userName;
        return this.sendRequest<string>("DELETE", url);
    }
    
    deleteRole(roleName: string): Observable<string> {
	let url = this.url + "/deleteUser/" + roleName;
        return this.sendRequest<string>("DELETE", url);
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
        }).pipe(catchError(err => {
            return throwError(err.status)}));
        }

}

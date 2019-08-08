import { Injectable, Inject, InjectionToken } from "@angular/core";
import { HttpClient, HttpParams} from "@angular/common/http";
import { Observable } from "rxjs";
import { Role } from "../model/role.model";
import { User } from "../model/user.model";
import { UserUpdate } from "../model/userUpdate.model";
import { RoleUpdate } from "../model/roleUpdate.model";
import { GlobalService } from "../global.service";

@Injectable()
export class RestDataSource {
    private url:string;
    
    constructor(private http: HttpClient, private globalService:GlobalService) {
            this.url = globalService.REST_URL;
        }
                
    getRole(): Observable<Role> {
        let url = this.url + "/angular/getRoles";
        return this.globalService.sendRequest<Role>("GET", url);
    }
    
    getRoles(): Observable<Role[]> {
        let url = this.url + "/GetRecords/Roles?parseRoleOpts=true";
        return this.globalService.sendRequest<Role[]>("GET", url);
    }
    
    insertRole(role: Role): Observable<Role> {
	let url = this.url + "/InsertRecord/Roles";
        return this.globalService.sendRequest<Role>("POST", url, role);
    }
    
    updateRole(role: RoleUpdate): Observable<RoleUpdate> {
	let url = this.url + "/UpdateRecords/Roles";
        return this.globalService.sendRequest<RoleUpdate>("PUT", url, role);
    }
    
    getUser(username: string): Observable<User> {
        let params = new HttpParams();
        params = params.append('userName', username);

        let url = this.url + "/GetUserInfo";
        return this.globalService.sendRequest<User>("GET", url, null, params);
    }
    
    getUsers(): Observable<User[]> {
        let url = this.url + "/GetRecords/Users";
        return this.globalService.sendRequest<User[]>("GET", url);
    }
    
    insertUser(user: User): Observable<User> {
	let url = this.url + "/InsertRecord/Users";
        return this.globalService.sendRequest<User>("POST", url, user);
    }
    
    updateUser(user: UserUpdate): Observable<UserUpdate> {
	let url = this.url + "/UpdateRecords/Users";     
        return this.globalService.sendRequest<UserUpdate>("PUT", url, user);
    }
    
    deleteUser(ntsid: string): Observable<string> {
	let url = this.url + '/DeleteRecords/Users?filter={"NTSID":"'+ntsid+'"}';
        return this.globalService.sendRequest<string>("DELETE", url);
    }
    
    deleteRole(rolename: string): Observable<string> {
	let url = this.url + '/DeleteRecords/Roles?filter={"ROLENAME":"'+rolename+'"}';
        return this.globalService.sendRequest<string>("DELETE", url);
    }
}

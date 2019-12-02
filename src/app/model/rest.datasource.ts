import { Injectable, Inject, InjectionToken } from "@angular/core";
import { HttpClient, HttpParams} from "@angular/common/http";
import { Observable } from "rxjs";
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
                
    getRole(): Observable<object> {
        let url = this.url + "/angular/getRoles";
        return this.globalService.sendRequest<object>("GET", url);
    }
    
    getSchemesList(): Observable<string[]> {
        let url = this.url + "/angular/getDictionariesList";
        return this.globalService.sendRequest<string[]>("GET", url);
    }
    
    getSchemesInfo(): Observable<object> {
        let url = this.url + "/angular/getDictionariesInfo";
        return this.globalService.sendRequest<object>("GET", url);
    }
    
    getRoles(): Observable<object[]> {
        let url = this.url + "/GetRecords/Roles?parseRoleOpts=true";
        return this.globalService.sendRequest<object[]>("GET", url);
    }
    
    getScheme(scheme: string): Observable<object[]> {
        let url = this.url + "/GetRecords/" + scheme ;
        return this.globalService.sendRequest<object[]>("GET", url);
    }
    
    getSchemeByFilter(page: string, schemeName: string): Observable<object[]> {
        let url = this.url + "/GetRecords/" + schemeName + "?parseRoleOpts=true";        
        let params = new HttpParams();
        params = params.append('filter', page);
        return this.globalService.sendRequest<object[]>("GET", url, null, params);
    }
    
    insertRole(role: object): Observable<object> {
	let url = this.url + "/InsertRecord/Roles";
        return this.globalService.sendRequest<object>("POST", url, role);
    }
    
    insertScheme(scheme: object, schemeName: string) {
        let url = this.url + "/InsertRecord/" + schemeName;
        return this.globalService.sendRequest<object>("POST", url, scheme);
    }
    
    updateRole(role: RoleUpdate): Observable<RoleUpdate> {
	let url = this.url + "/UpdateRecords/Roles";
        return this.globalService.sendRequest<RoleUpdate>("PUT", url, role);
    }
    
    updateScheme(roleUpdate: RoleUpdate, schemeName: string): Observable<RoleUpdate> {
	let url = this.url + "/UpdateRecords/" + schemeName;
        return this.globalService.sendRequest<RoleUpdate>("PUT", url, roleUpdate);
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
    
    getUsersByFilter(filterParam: string): Observable<User[]> {
        let url = this.url + "/GetRecords/Users";        
        let params = new HttpParams();
        params = params.append('filter', filterParam);
        return this.globalService.sendRequest<User[]>("GET", url, null, params);
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
    
    deleteScheme(scheme: object, schemeName: string): Observable<string> {
	let url = this.url + '/DeleteRecords/' + schemeName + '?filter=' + JSON.stringify(scheme);
        return this.globalService.sendRequest<string>("DELETE", url);
    }
    
    downloadScheme(schemeName: string): Observable<Blob> {		
	let params = new HttpParams();
        params = params.append('type', 'excel');

        let url = this.url + "/ExportData/" + schemeName;
        return this.globalService.sendRequest<Blob>("GET", url, null, params, null, "blob");
    }
}

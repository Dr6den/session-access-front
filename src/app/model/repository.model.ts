import { Injectable } from "@angular/core";
import { Role } from "../model/role.model";
import { User } from "../model/user.model";
import { Observable, Subscription } from "rxjs";
import { RestDataSource } from "./rest.datasource";
import { UserUpdate } from "../model/userUpdate.model";
import { RoleUpdate } from "../model/roleUpdate.model";

@Injectable()
export class Model {
    roles = [];
    users;
    model;
    subscriptions = new Subscription();

    constructor(private dataSource: RestDataSource) {
        let authToken = JSON.parse(localStorage.getItem('currentUser'));
        if (authToken) {
            this.getRoles();
        }
    }
    
    getRole(): Observable<object> {
        return this.dataSource.getRole();
    }
    
    getSchemesList(): Observable<string[]> {
        return this.dataSource.getSchemesList();
    }
    
    getSchemesInfo(): Observable<object> {
        return this.dataSource.getSchemesInfo();
    } 
     
    getScheme(scheme: string): Observable<object> {
        return this.dataSource.getScheme(scheme);
    }
     
    getRoles(): void {
	this.dataSource.getRoles().subscribe((data) => {
		if (data[0] != undefined) {                    
                    data.forEach((r) => {
                        let role = new Role(r);
                        this.roles.push(role);
                    });
		}
	});
    }
    
    getObservableRoles(): Observable<object[]> {
        return this.dataSource.getRoles();
    }
    
    getObservableSchemeByFilter(page: string, schemeName: string): Observable<object[]> {
        return this.dataSource.getSchemeByFilter(page, schemeName);
    }
    
    getObservableUsersByFilter(page: string): Observable<User[]> {
        return this.dataSource.getUsersByFilter(page);
    }
    
    getRolesArray(): Role[] {
        return this.roles;
    }
    
    insertRole(role: object): Observable<object> {
        return this.dataSource.insertRole(role);
    }
    
    insertScheme(scheme: object, schemeName: string) {
        return this.dataSource.insertScheme(scheme, schemeName);
    }
    
    updateRole(role: RoleUpdate): Observable<RoleUpdate> {
        return this.dataSource.updateRole(role);
    }
    
    updateScheme(scheme: RoleUpdate, schemeName: string) {
        return this.dataSource.updateScheme(scheme, schemeName);
    }
    
    getUser(username: string): Observable<User> {
        return this.dataSource.getUser(username);
    }
    
    getUsersArray(): User[] {
        return this.users;
    }
    
    getUsers(): void {
        this.dataSource.getUsers().subscribe((data) => {
		if (data[0] != undefined) {
			this.users = data;
		}
	});
    }
    
    getObservableUsers(): Observable<User[]> {
        return this.dataSource.getUsers();
    }
    
    insertUser(user: User): Observable<User> {
        return this.dataSource.insertUser(user);
    }
    
    updateUser(user: UserUpdate): Observable<UserUpdate> {
        return this.dataSource.updateUser(user);
    }
    
    deleteUser(ntsid: string) {
        this.dataSource.deleteUser(ntsid).subscribe();
    }
    
    deleteRole(rolename: string) {
        this.dataSource.deleteRole(rolename).subscribe();
    }
    
    deleteScheme(scheme: object, schemeName: string) {
        this.dataSource.deleteScheme(scheme, schemeName).subscribe();
    }
    
    downloadScheme(schemeName: string): void {
	this.dataSource.downloadScheme(schemeName).subscribe((data) => {
            let blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
            
            var downloadURL = window.URL.createObjectURL(data);
            var link = document.createElement('a');
            link.href = downloadURL;
            link.download = schemeName + ".xlsx";
            link.click();
	});
    }
    
    uploadSchemeFile(scheme: File, schemeName: string, stage: string): Observable<object> {
        return this.dataSource.uploadSchemeFile(scheme, schemeName, stage);
    }
    
    uploadScheme(scheme: object, schemeName: string, stage: string): Observable<object> {
        return this.dataSource.uploadScheme(scheme, schemeName, stage);
    }
    
    getTemporaryTable(temporaryId: string): Observable<object> {
        return this.dataSource.getTemporaryScheme(temporaryId);
    }
}

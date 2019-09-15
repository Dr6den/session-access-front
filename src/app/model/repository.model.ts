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
    
    getRolesArray(): Role[] {
        return this.roles;
    }
    
    insertRole(role: object): Observable<object> {
        return this.dataSource.insertRole(role);
    }
    
    updateRole(role: RoleUpdate): Observable<RoleUpdate> {
        return this.dataSource.updateRole(role);
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
}

import { Injectable } from "@angular/core";
import { Role } from "../model/role.model";
import { User } from "../model/user.model";
import { Observable, Subscription } from "rxjs";
import { RestDataSource } from "./rest.datasource";

@Injectable()
export class Model {
    roles;
    users;
    model;
    subscriptions = new Subscription();

    constructor(private dataSource: RestDataSource) {
    }
    
    getRole(): Observable<Role> {
        return this.dataSource.getRole();
    }
    
    getRoles(): void {
	this.dataSource.getRoles().subscribe((data) => {
		if (data[0] != undefined) {
			this.roles = data;
		}
	});
    }
    
    getRolesArray(): Role[] {
        return this.roles;
    }
    
    saveRole(role: Role): Observable<Role> {
        return this.dataSource.saveRole(role);
    }
    
    getUser(): Observable<User> {
        return this.dataSource.getUser();
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
    
    saveUser(user: User): Observable<User> {
        return this.dataSource.saveUser(user);
    }
}

import { Injectable } from "@angular/core";
import { Role } from "../model/role.model";
import { User } from "../model/user.model";
import { Observable, Subscription } from "rxjs";
import { RestDataSource } from "./rest.datasource";
import { UserUpdate } from "../model/userUpdate.model";
import { RoleUpdate } from "../model/roleUpdate.model";

@Injectable()
export class Model {
    roles;
    users;
    model;
    subscriptions = new Subscription();

    constructor(private dataSource: RestDataSource) {
        this.getRoles();
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
    
    insertRole(role: Role): Observable<Role> {
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
    
    insertUser(user: User): Observable<User> {
        return this.dataSource.insertUser(user);
    }
    
    updateUser(user: UserUpdate): Observable<UserUpdate> {
        return this.dataSource.updateUser(user);
    }
    
    deleteUser(user: User) {
        this.dataSource.deleteUser(user.NTSID).subscribe();
    }
    
    deleteRole(role: Role) {
        this.dataSource.deleteRole(role.ROLENAME).subscribe();
    }
}

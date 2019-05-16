import { Injectable } from "@angular/core";
import { Role } from "../model/role.model";
import { User } from "../model/user.model";
import { Observable, Subscription } from "rxjs";
import { RestDataSource } from "./rest.datasource";
import { take, first, takeUntil, map } from 'rxjs/operators';

@Injectable()
export class Model {
    role;
    model;
    subscriptions = new Subscription();

    constructor(private dataSource: RestDataSource) {
    }
    
    getRoles(): Observable<Role> {
        return this.dataSource.getRoles();
    }
    
    saveRole(role: Role): Observable<Role> {
        return this.dataSource.saveRole(role);
    }
    
    getUser(): Observable<User> {
        return this.dataSource.getUser();
    }
    
    saveUser(user: User): Observable<User> {
        return this.dataSource.saveUser(user);
    }
}

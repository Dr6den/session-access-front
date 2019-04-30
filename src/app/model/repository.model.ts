import { Injectable } from "@angular/core";
import { Role } from "../model/role.model";
import { Observable, Subscription } from "rxjs";
import { RestDataSource } from "./rest.datasource";
import { take, first, takeUntil, map } from 'rxjs/operators';

@Injectable()
export class Model {
    role;
    subscriptions = new Subscription();

    constructor(private dataSource: RestDataSource) {
    }
    
    getRoles(): Observable<Role> {
        return this.dataSource.getRoles();
    }
    
    saveRole(role: Role) {
        this.dataSource.saveRole(role);
    }
}

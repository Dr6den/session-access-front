import { Injectable, InjectionToken, Inject } from '@angular/core';
import { Model } from "../../../model/repository.model";
import { User } from "../../../model/user.model";

@Injectable({ providedIn: 'root' })
export class FillInTableService {
    constructor(private model: Model) { }
    
    fillRowsToUsersTable(): Promise<any> {
        let columns = [];
        return this.model.getObservableUsers().toPromise()
            .then((ousers) => {ousers.forEach((user) => {
            columns.push({"Actions":"", "USERID": user.USERID, "USERNAME": user.USERNAME, "NTSID": user.NTSID, "Role": user.ROLES});});
            return columns;
            });         
    }
    
    fillSortingToUsersTable(): any {
        return {column: 'USERID', descending: false};
    }
    
    fillColumnsToUserTable(): any[] {
        return [
            {
                display: 'Actions', //The text to display
                variable: 'Actions', //The name of the key that's apart of the data array
                filter: 'text' //The type data type of the column (number, text, date, etc.)
            },
            {
                display: 'USERID', //The text to display
                variable: 'USERID', //The name of the key that's apart of the data array
                filter: 'text' //The type data type of the column (number, text, date, etc.)
            },
            {
                display: 'USERNAME', //The text to display
                variable: 'USERNAME', //The name of the key that's apart of the data array
                filter: 'text' //The type data type of the column (number, text, date, etc.)
            },
            {
                display: 'NTSID', //The text to display
                variable: 'NTSID', //The name of the key that's apart of the data array
                filter: 'text' //The type data type of the column (number, text, date, etc.)
            },
            {
                display: 'Role', //The text to display
                variable: 'Role', //The name of the key that's apart of the data array
                filter: 'text' //The type data type of the column (number, text, date, etc.)
            }
        ];
    }
    
     fillRowsToRolesTable(): Promise<any> {
        let columns = [];
        return this.model.getObservableRoles().toPromise()
            .then((ousers) => {ousers.forEach((role) => {
                let opt = "ACCESS: " + role.ACCESS + "-GBU: " + role.GBU + "-REGION: " + role.REGION + "-COGS: " + role.COGS;
                columns.push({"Actions": "", "Applications": role.Application, "Options": opt, "Rolename": role.ROLENAME});});
                return columns;
            });       
    }
    
    fillSortingToRolesTable(): any {
        return {column: 'Rolename', descending: false};
    }
    
    fillColumnsToRolesTable(): any[] {
        return [
            {
                display: 'Actions', //The text to display
                variable: 'Actions', //The name of the key that's apart of the data array
                filter: 'text' //The type data type of the column (number, text, date, etc.)
            },
            {
                display: 'Applications',
                variable: 'Applications',
                filter: 'text'
            },
            {
                display: 'Options', //The text to display
                variable: 'Options', //The name of the key that's apart of the data array
                filter: 'text' //The type data type of the column (number, text, date, etc.)
            },
            {
                display: 'Rolename', //The text to display
                variable: 'Rolename', //The name of the key that's apart of the data array
                filter: 'text' //The type data type of the column (number, text, date, etc.)
            }
        ];
    }
}
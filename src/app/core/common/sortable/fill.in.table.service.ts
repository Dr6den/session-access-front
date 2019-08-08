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
            columns.push({"USERID": user.USERID, "USERNAME": user.USERNAME, "NTSID": user.NTSID, "Role": user.ROLES, "Edit":""});});
            return columns;
            });         
    }
    
    fillSortingToUsersTable(): any {
        return {column: 'USERID', descending: false};
    }
    
    fillColumnsToUserTable(): any[] {
        return [
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
            },
            {
                display: 'Edit', //The text to display
                variable: 'Edit', //The name of the key that's apart of the data array
                filter: 'text' //The type data type of the column (number, text, date, etc.)
            }
        ];
    }
}
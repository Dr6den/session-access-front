import { Injectable, InjectionToken, Inject } from '@angular/core';
import { Model } from "../../../model/repository.model";
import { User } from "../../../model/user.model";
import { Role } from "../../../model/role.model";

@Injectable({ providedIn: 'root' })
export class FillInTableService {
    constructor(private model: Model) { }
    
    fillColumnsToSchemeTable(schemeName: string): any[] {
        let answ: any[] = [];
        this.model.getSchemesInfo().toPromise()
            .then((data) => {              
                let schemeElements = data[schemeName];
                this.addColumnToJson("Actions", answ);
                Object.keys(schemeElements).forEach((elem) => {
                    this.addColumnToJson(elem, answ);
                })   
                console.log(JSON.stringify(answ))
                return answ;             
        });  
        return answ;      
    }
    
    private addColumnToJson(value: string, json: any[]): void {
        json.push("{" +
            "'display':'" + value + "',"+ //The text to display
            "'variable':'" + value + "',"+ //The name of the key that's apart of the data array
            "'filter': 'text'"+ //The type data type of the column (number, text, date, etc.)
            "}");
    }
    
    fillRowsToUsersTable(): Promise<any> {
        let columns = [];
        return this.model.getObservableUsers().toPromise()
            .then((ousers) => {
                let vals = Object.values(ousers["values"]);
                vals.forEach((user) => {
                let rolesOfUser:string = '';
                let isFirstRole:boolean = true;
                user.ROLES.forEach((r) => {
                    if (!isFirstRole) { rolesOfUser = rolesOfUser + ", "; }
                    rolesOfUser = rolesOfUser + r.Application + " : " + r.ROLENAME;
                    isFirstRole = false;
                });
                columns.push({"Actions":"", "USERID": user.USERID, "USERNAME": user.USERNAME, "NTSID": user.NTSID, "Role": rolesOfUser});});
                return columns;
            });         
    }
    
    fillRowsToUsersTableFromOutsideSource(source: object[]) {
        let columns = [];
        source.forEach((user) => {
            let rolesOfUser:string = '';
            let isFirstRole:boolean = true;
            let userType = user as User;
            userType.ROLES.forEach((r) => {
                if (!isFirstRole) { rolesOfUser = rolesOfUser + ", "; }
                rolesOfUser = rolesOfUser + r.Application + " : " + r.ROLENAME;
                isFirstRole = false;
            });
            columns.push({"Actions":"", "USERID": user["USERID"], "USERNAME": user["USERNAME"], "NTSID": user["NTSID"], "Role": rolesOfUser});
        });
        return columns;
    }
    
    fillUsersByEmptyColumns() {
        let columns = [];
        return columns;
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
            .then((ousers) => {let vals = Object.values(ousers["values"]);
                vals.forEach((role) => {
                let roleStr = new Role(role);
                let opt = roleStr.getArrayOfOptionsObject();
                columns.push({"Actions": "", "Applications": roleStr.application, "Options": opt, "Rolename": roleStr.rolename});
            });
                return columns;
            });       
    }
    
    fillRowsToRolesTableFromOutsideSource(source: object[]) {
        let columns = [];
        source.forEach((role) => {
            //console.log(JSON.stringify(role))
            let roleStr = new Role(role);
            let opt = roleStr.getArrayOfOptionsObject();
            columns.push({"Actions": "", "Applications": roleStr.application, "Options": opt, "Rolename": roleStr.rolename});
        });
        return columns;
    }
    
    fillRolesByEmptyColumns() {
        let columns = [];
        return columns;
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
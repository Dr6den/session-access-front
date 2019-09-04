import { Component, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { Model } from "../model/repository.model";
import { User } from "../model/user.model";
import { TableSortable } from "./common/sortable/table.sortable.component";
import { FillInTableService } from "./common/sortable/fill.in.table.service";

@Component({
    selector: "usersTable",
    templateUrl: "users.roles.table.component.html",
    styleUrls: ["users.roles.table.component.css"]
})
export class UsersAndRolesTableComponent {
    public title: string = "Users";
    levelNum:number;
    levels:Array<Object> = [
        {num: 10, name: "10"},
        {num: 50, name: "50"},
        {num: 100, name: "100"}
    ];

    constructor(private model: Model, private router: Router, private fillInTableService: FillInTableService) {
        this.model.getRoles();
        this.roleSorting = this.fillInTableService.fillSortingToRolesTable();
        this.roleColumns = fillInTableService.fillColumnsToRolesTable();
        fillInTableService.fillRowsToRolesTable().then((promiserows) => { 
            this.roleRows = promiserows;
        });
        this.model.getUsers();
        this.userSorting = this.fillInTableService.fillSortingToUsersTable();
        this.userColumns = fillInTableService.fillColumnsToUserTable();
        fillInTableService.fillRowsToUsersTable().then((promiserows) => { 
            this.userRows = promiserows;
        });
    }
    
    resetForm() {
        this.router.navigateByUrl("/");
    }
    
    //sorting table properties
    userColumns: any[];
    userSorting: any;    
    userRows: any[];
    roleColumns: any[];
    roleSorting: any;    
    roleRows: any[];
}

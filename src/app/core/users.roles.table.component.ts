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
    public numrecords: number;
    public shown: number;

    constructor(private model: Model, private router: Router, private fillInTableService: FillInTableService) {
        this.model.getRoles();
        this.roleSorting = this.fillInTableService.fillSortingToRolesTable();
        this.roleColumns = fillInTableService.fillColumnsToRolesTable();
        fillInTableService.fillRowsToRolesTable().then((promiserows) => { 
            this.roleRows = promiserows;
            this.numrecords = this.roleRows.length;
            this.shown = this.roleRows.length;
        });
        this.model.getUsers();
        this.userSorting = this.fillInTableService.fillSortingToUsersTable();
        this.userColumns = fillInTableService.fillColumnsToUserTable();
        fillInTableService.fillRowsToUsersTable().then((promiserows) => { 
            this.userRows = promiserows;
            this.numrecords = this.userRows.length;
            this.shown = this.userRows.length;
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

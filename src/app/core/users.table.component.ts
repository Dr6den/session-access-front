import { Component, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { Model } from "../model/repository.model";
import { User } from "../model/user.model";
import { TableSortable } from "./common/sortable/table.sortable.component";
import { FillInTableService } from "./common/sortable/fill.in.table.service";

@Component({
    selector: "usersTable",
    templateUrl: "users.table.component.html",
    styleUrls: ["users.table.component.css"]
})
export class UsersTableComponent {
    public numrecords: number;
    public shown: number;

    constructor(private model: Model, private router: Router, private fillInTableService: FillInTableService) {
        this.model.getUsers();
        this.sorting = this.fillInTableService.fillSortingToUsersTable();
        this.columns = fillInTableService.fillColumnsToUserTable();
        fillInTableService.fillRowsToUsersTable().then((promiserows) => { 
            this.rows = promiserows;
            this.numrecords = this.rows.length;
            this.shown = this.rows.length;
        });
    }
    
    resetForm() {
        this.router.navigateByUrl("/");
    }
    
    //sorting table properties
    columns: any[];
    sorting: any;    
    rows: any[];
}

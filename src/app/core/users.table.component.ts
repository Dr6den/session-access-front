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
    public popoverTitle: string = 'Delete the user';
    public popoverMessage: string = 'Are you sure you want delete the user?';
    public cancelClicked: boolean = false;
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

    getItems(): Array<User> {
        let roles :User[] = this.model.getUsersArray();
        return roles;
    }
    
    resetForm() {
        this.router.navigateByUrl("/");
    }
    
    deleteItem(item: User) {
 	this.model.deleteUser(item.NTSID);
	window.location.reload();
    }
    
    //sorting table properties
    columns: any[];
    sorting: any;    
    rows: any[];
}

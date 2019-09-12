import { Component, Inject, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Model } from "../model/repository.model";
import { User } from "../model/user.model";
import { TableSortable } from "./common/sortable/table.sortable.component";
import { FillInTableService } from "./common/sortable/fill.in.table.service";
import { UserInputPopupComponent } from "../modalwindows/business/user.input.popup.component";

@Component({
    selector: "usersTable",
    templateUrl: "users.table.component.html",
    styleUrls: ["users.table.component.css"]
})
export class UsersTableComponent {
    public title: string = "Users";
    @ViewChild(UserInputPopupComponent) userInputPopup:UserInputPopupComponent;
    levelNum:number;
    
    //sorting table properties
    userColumns: any[];
    userSorting: any;    
    userRows: any[];
    roleColumns: any[];
    roleSorting: any;    
    roleRows: any[];
    
    levels:Array<Object> = [
        {num: 10, name: "10"},
        {num: 50, name: "50"},
        {num: 100, name: "100"}
    ];
    selectedLevel = this.levels[0];

    constructor(private model: Model, private router: Router, private fillInTableService: FillInTableService) {
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
    
    userInput(user?: User) {
        this.userInputPopup.openModalDialog(user);
    }
}

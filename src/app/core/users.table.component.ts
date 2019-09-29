import { Component, Inject, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Model } from "../model/repository.model";
import { User } from "../model/user.model";
import { TableSortable } from "./common/sortable/table.sortable.component";
import { FillInTableService } from "./common/sortable/fill.in.table.service";
import { UserInputPopupComponent } from "../modalwindows/business/user.input.popup.component";
import { TableContainer } from "../model/table.container";

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
    pageNumber: number;
    
    tableContainer: TableContainer;
    usersReserve: object[] = [];
    
    levels:Array<Object> = [
        {num: 100, name: "100"},
        {num: 50, name: "50"},
        {num: 10, name: "10"}
    ];

    constructor(private model: Model, private router: Router, private fillInTableService: FillInTableService) {
        this.model.getUsers();
        this.userSorting = this.fillInTableService.fillSortingToUsersTable();
        this.userColumns = fillInTableService.fillColumnsToUserTable();
        fillInTableService.fillRowsToUsersTable().then((promiserows) => { 
            this.userRows = promiserows;
        });
        
        this.model.getObservableUsers().toPromise()
            .then((ousers) => {let vals = Object.values(ousers["values"]);
                vals.forEach((role) => {this.usersReserve.push(role)});
                this.tableContainer = new TableContainer(this.usersReserve, 100);
            });
        this.pageNumber = 1;
    }
    
    resetForm() {
        this.router.navigateByUrl("/");
    }
    
    userInput(user?: User) {
        this.userInputPopup.openModalDialog(user);
    }
    
    changeUsersOutputOnPage(event: object) {
        this.tableContainer = new TableContainer(this.usersReserve, Number.parseInt(event.toString()));
        this.roleRows = this.fillInTableService.fillRowsToUsersTableFromOutsideSource(this.tableContainer.getRolesOnPage(0));
    }
    
    nextPageTabulate() {
        if(this.pageNumber < this.tableContainer.numberOfPages){
            this.roleRows = this.fillInTableService.fillRowsToUsersTableFromOutsideSource(this.tableContainer.getRolesOnPage(this.pageNumber));
            this.pageNumber++;
        }
    }
    
    previousPageTabulate() {
        if(this.pageNumber > 1){
            this.roleRows = this.fillInTableService.fillRowsToUsersTableFromOutsideSource(this.tableContainer.getRolesOnPage(this.pageNumber - 2));
            this.pageNumber--;
        }
    }
    
    firstPageTabulate() {
        if(this.pageNumber > 1){
            this.roleRows = this.fillInTableService.fillRowsToUsersTableFromOutsideSource(this.tableContainer.getRolesOnPage(0));
            this.pageNumber = 1;
        }
    }
    
    lastPageTabulate() {
        if(this.pageNumber < this.tableContainer.numberOfPages){
            this.roleRows = this.fillInTableService.fillRowsToUsersTableFromOutsideSource(this.tableContainer.getRolesOnPage(this.tableContainer.numberOfPages - 1));
            this.pageNumber = this.tableContainer.numberOfPages;
        }
    }
}

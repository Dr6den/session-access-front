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
    currentPageNumber: number;
    numberOfPages: number;
    
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
        this.currentPageNumber = 1;
        this.numberOfPages = 100;
    }
    
    resetForm() {
        this.router.navigateByUrl("/");
    }
    
    userInput(user?: User) {
        this.userInputPopup.openModalDialog(user);
    }
    
    changeUsersOutputOnPage(event: object) {
        this.tableContainer = new TableContainer(this.usersReserve, Number.parseInt(event.toString()));
        this.userRows = this.fillInTableService.fillRowsToUsersTableFromOutsideSource(this.tableContainer.getRolesOnPage(0));
    }
    
    nextPageTabulate() {
        if(this.currentPageNumber < this.tableContainer.numberOfPages){
            this.userRows = this.fillInTableService.fillRowsToUsersTableFromOutsideSource(this.tableContainer.getRolesOnPage(this.currentPageNumber));
            this.currentPageNumber++;
        }
    }
    
    previousPageTabulate() {
        if(this.currentPageNumber > 1){
            this.userRows = this.fillInTableService.fillRowsToUsersTableFromOutsideSource(this.tableContainer.getRolesOnPage(this.currentPageNumber - 2));
            this.currentPageNumber--;
        }
    }
    
    firstPageTabulate() {
        if(this.currentPageNumber > 1){
            this.userRows = this.fillInTableService.fillRowsToUsersTableFromOutsideSource(this.tableContainer.getRolesOnPage(0));
            this.currentPageNumber = 1;
        }
    }
    
    lastPageTabulate() {
        if(this.currentPageNumber < this.tableContainer.numberOfPages){
            this.userRows = this.fillInTableService.fillRowsToUsersTableFromOutsideSource(this.tableContainer.getRolesOnPage(this.tableContainer.numberOfPages - 1));
            this.currentPageNumber = this.tableContainer.numberOfPages;
        }
    }
    
    filter(event: string) {
        let page = '[{"USERNAME":"' + event + '"},{"USERID":"' + event + '"}]';    
        this.model.getObservableUsersByFilter(page).toPromise()
            .then((user) => {
                if (user["message"]) {
                    this.usersReserve = [];
                    this.tableContainer = new TableContainer(this.usersReserve, this.numberOfPages);
                    this.userRows = this.fillInTableService.fillUsersByEmptyColumns();
                } else {
                    let usersValues = Object.values(user["values"]);
                    this.usersReserve = usersValues;
                    this.tableContainer = new TableContainer(this.usersReserve, this.numberOfPages); 
                    this.userRows = this.fillInTableService.fillRowsToUsersTableFromOutsideSource(this.tableContainer.getRolesOnPage(0));                   
                }  
                this.currentPageNumber = 1;
            }).catch((response) => this.checkError(response));
    }
    
    checkError(errorCode: object) {
    }
}

import { Component, Inject, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Model } from "../model/repository.model";
import { User } from "../model/user.model";
import { TableSortable } from "./common/sortable/table.sortable.component";
import { FillInTableService } from "./common/sortable/fill.in.table.service";
import { UserInputPopupComponent } from "../modalwindows/business/user.input.popup.component";
import { UploadPopupComponent } from "../modalwindows/business/uploadmodal/upload.popup.component";
import { TableContainer } from "../model/table.container";

@Component({
    selector: "usersTable",
    templateUrl: "users.table.component.html",
    styleUrls: ["users.table.component.css"]
})
export class UsersTableComponent {
    public title: string = "Users";
    @ViewChild(UserInputPopupComponent, {static: false}) userInputPopup:UserInputPopupComponent;
    @ViewChild(UploadPopupComponent, {static: false}) uploadPopup:UploadPopupComponent;
    levelNum:number;
    tableNumberOfColumns: number = 5;
    
    //sorting table properties
    userColumns: any[];
    userSorting: any;    
    userRows: any[];
    currentPageNumber: number;
    numberOfPages: number;
    
    tableContainer: TableContainer;
    usersReserve: object[] = [];
    previousFilter: object = {};
    levels:Array<Object> = [
        {num: 0, name: "All"},
        {num: 100, name: "100"},
        {num: 50, name: "50"},
        {num: 10, name: "10"}
    ];
    
    fileForUpload: File;
    uploadError: string = "error message";
    
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
        if (event.toString() === "All") {
            window.location.reload();
        } else {
            this.tableContainer = new TableContainer(this.usersReserve, Number.parseInt(event.toString()));
            this.userRows = this.fillInTableService.fillRowsToUsersTableFromOutsideSource(this.tableContainer.getRolesOnPage(0));
        }
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
    
    setPreviousFilter(column: string, name: string) {
        if (!this.previousFilter[column]) {
            this.previousFilter[column] = [];
        }
        this.previousFilter[column].push(name);
    }
    
    getPreviousFilter(): string {
        let result = '';
        for (let el in this.previousFilter) {
            this.previousFilter[el].forEach((n) => {
                if (el === "Role") {
                    result = result + '{"ROLES":{"Application":"' + n + '"}},';
                } else {
                    result = result + '{"' + el + '":"' + n + '"},';
                }
            });
            
        }
        return result
    }
    
    getRestrictivePreviousFilter(): string {
        let hasMoreThanOneFiltered = Object.keys(this.previousFilter).length > 1;
        let result = '';
        if (!hasMoreThanOneFiltered) {            
            for (let el in this.previousFilter) {
                this.previousFilter[el].forEach((n) => {
                    if (el === "Role") {
                        result = result + '{"ROLES":{"Application":"' + n + '"}},';
                    } else {
                        result = result + '{"' + el + '":"' + n + '"},';
                    }
                });            
            }
            result = result.replace(/.$/,"");
        } else {
            //need form query like this: [ {"Entity":"", "NOT Entity":["", "not entity 5"], "GBU":["MED","SU"]}]
            let filObj = this.previousFilter;
            let firstObj = Object.keys(filObj)[0];
            let firstObjVals = filObj[Object.keys(filObj)[0]];
            firstObjVals.forEach((foVals) => {
                if (firstObj === "Role") {
                        result = result + '{"ROLES":{"Application":"' + foVals + '"},';
                    } else {
                        result = result + '{"' + firstObj + '":"' + foVals + '",';
                    }                
                Object.keys(filObj).filter(function(k, i) {
                    return i >= 1 && i < Object.keys(filObj).length;
                    }).forEach(function(k) {
                        if (k === "Role") {
                            result = result + '"ROLES":{"Application":[';
                            filObj[k].forEach((r) => {
                                result = result + '"' + r + '",';
                            });
                            result = result.replace(/.$/,"]}");
                        } else {
                            result = result + '"' + k + '":[';
                            filObj[k].forEach((r) => {
                                result = result + '"' + r + '",';
                            });
                            result = result.replace(/.$/,"]");
                        }
                        
                    });
                result = result + '},';
            })
            result = result.replace(/.$/,"");
        }        
        return result;
    }
    
    filterByNames(event) {
        let page:string = "[";
        if (this.previousFilter[event.column]) { 
            if (this.previousFilter[event.column].length > 0) {
                this.previousFilter[event.column] = [];
            }  
        }   
        event.names.forEach((name) => {
                this.setPreviousFilter(event.column, name);   
        });
        page = page  + this.getRestrictivePreviousFilter() + "]";

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
    
    downloadScheme() {
        this.model.downloadScheme(this.title);
    }
    
    uploadScheme(event) {
       
    }
    
    selectSchemeForUpload(event: any) {
        this.fileForUpload = event.target.files[0];
        if (!this.fileForUpload) {
            this.fileForUpload = event.srcElement.files[0];
        }
  
        this.model.uploadSchemeFile(this.fileForUpload, this.title, "upload").toPromise().then((data) => {
            this.uploadPopup.openModalDialog(data, this.fileForUpload.name);
        }).catch((response) => {
            this.uploadError = response;
        });
    }
}

import { Component, Inject, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Model } from "../model/repository.model";
import { User } from "../model/user.model";
import { TableSortable } from "./common/sortable/table.sortable.component";
import { FillInTableService } from "./common/sortable/fill.in.table.service";
import { RoleInputPopupComponent } from "../modalwindows/business/role.input.popup.component";
import { TableContainer } from "../model/table.container";

@Component({
    selector: "rolesTable",
    templateUrl: "roles.table.component.html",
    styleUrls: ["roles.table.component.css"]
})
export class RolesTableComponent {
    public title: string = "Roles";
    @ViewChild(RoleInputPopupComponent) roleInputPopup:RoleInputPopupComponent;
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
    rolesReserve: object[] = [];
    
    levels:Array<Object> = [
        {num: 100, name: "100"},
        {num: 50, name: "50"},
        {num: 10, name: "10"}
    ];
    
    constructor(private model: Model, private router: Router, private fillInTableService: FillInTableService) {
        this.model.getRoles();
        this.roleSorting = this.fillInTableService.fillSortingToRolesTable();
        this.roleColumns = fillInTableService.fillColumnsToRolesTable();
        fillInTableService.fillRowsToRolesTable().then((promiserows) => { 
            this.roleRows = promiserows;
        });
        
        this.model.getObservableRoles().toPromise()
            .then((ousers) => {let vals = Object.values(ousers["values"]);
                vals.forEach((role) => {this.rolesReserve.push(role)});
                this.tableContainer = new TableContainer(this.rolesReserve, 100);
            });
        this.pageNumber = 1;       
    }
    
    resetForm() {
        this.router.navigateByUrl("/");
    }
    
    roleInput(role?: object) {
        this.roleInputPopup.openModalDialog(role);
    }
    
    changeRolesOutputOnPage(event: object) {
        this.tableContainer = new TableContainer(this.rolesReserve, Number.parseInt(event.toString()));
        this.roleRows = this.fillInTableService.fillRowsToRolesTableFromOutsideSource(this.tableContainer.getRolesOnPage(0));
    }
    
    nextPageTabulate() {
        if(this.pageNumber < this.tableContainer.numberOfPages){
            this.roleRows = this.fillInTableService.fillRowsToRolesTableFromOutsideSource(this.tableContainer.getRolesOnPage(this.pageNumber));
            this.pageNumber++;
        }
    }
    
    previousPageTabulate() {
        if(this.pageNumber > 1){
            this.roleRows = this.fillInTableService.fillRowsToRolesTableFromOutsideSource(this.tableContainer.getRolesOnPage(this.pageNumber - 2));
            this.pageNumber--;
        }
    }
    
    firstPageTabulate() {
        if(this.pageNumber > 1){
            this.roleRows = this.fillInTableService.fillRowsToRolesTableFromOutsideSource(this.tableContainer.getRolesOnPage(0));
            this.pageNumber = 1;
        }
    }
    
    lastPageTabulate() {
        if(this.pageNumber < this.tableContainer.numberOfPages){
            this.roleRows = this.fillInTableService.fillRowsToRolesTableFromOutsideSource(this.tableContainer.getRolesOnPage(this.tableContainer.numberOfPages - 1));
            this.pageNumber = this.tableContainer.numberOfPages;
        }
    }
}
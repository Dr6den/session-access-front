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
    
    rolesReserve: object[] = [];
    
    levels:Array<Object> = [
        {num: 10, name: "10"},
        {num: 50, name: "50"},
        {num: 100, name: "100"}
    ];
    selectedLevel = this.levels[0];
    
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
            });       
    }
    
    resetForm() {
        this.router.navigateByUrl("/");
    }
    
    roleInput(role?: object) {
        this.roleInputPopup.openModalDialog(role);
    }
    
    changeRolesOutputOnPage(event: object) {//console.log("hey" + JSON.stringify(this.rolesReserve))
       /* this.model.getObservableRolesFromPage(event.toString()).toPromise()
            .then((out)=>console.log("hey" + JSON.stringify(out)));*/
        let tableContainer = new TableContainer(this.rolesReserve, Number.parseInt(event.toString()));
        //console.log("hey" + JSON.stringify(tableContainer.getRolesOnPage(0)));
        this.roleRows = this.fillInTableService.fillRowsToRolesTableFromOutsideSource(tableContainer.getRolesOnPage(0));
    }
}
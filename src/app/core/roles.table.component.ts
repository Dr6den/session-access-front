import { Component, Inject, NgModule } from "@angular/core";
import { Router } from "@angular/router";
import { Model } from "../model/repository.model";
import { Role } from "../model/role.model";
import { TableSortable } from "./common/sortable/table.sortable.component";
import { FillInTableService } from "./common/sortable/fill.in.table.service";

@Component({
    selector: "rolesTable",
    templateUrl: "roles.table.component.html",
    styleUrls: ["roles.table.component.css"]
})
export class RolesTableComponent {
    public numrecords: number;
    public shown: number;

    constructor(private model: Model, private router: Router, private fillInTableService: FillInTableService) {
        this.model.getRoles();
        this.sorting = this.fillInTableService.fillSortingToRolesTable();
        this.columns = fillInTableService.fillColumnsToRolesTable();
        fillInTableService.fillRowsToRolesTable().then((promiserows) => { 
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
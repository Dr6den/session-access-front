import { Component, Inject, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Model } from "../model/repository.model";
import { User } from "../model/user.model";
import { SchemeMetadata } from "../model/scheme.metadata";
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
    schemeMetadata: SchemeMetadata;  
    roleColumns: any[];
    roleSorting: any;    
    roleRows: any[];
    currentPageNumber: number;
    numberOfPages: number;
    tablethwidth: string;
    tabletdwidth: string;
    numberOfColumns: number;
    previousFilter: object = {};
    
    tableContainer: TableContainer;
    rolesReserve: object[] = [];
    
    levels:Array<Object> = [
        {num: 100, name: "100"},
        {num: 50, name: "50"},
        {num: 10, name: "10"}
    ];
    
    constructor(private model: Model, private router: Router, private activeRouter: ActivatedRoute, private fillInTableService: FillInTableService) {        
        /*this.model.getObservableRoles().toPromise()
            .then((ousers) => {let vals = Object.values(ousers["values"]);
                vals.forEach((role) => {this.rolesReserve.push(role)});
                this.tableContainer = new TableContainer(this.rolesReserve, 100);
            });*/
        this.currentPageNumber = 1; 
        this.numberOfPages = 100;
    }
    
    accountTableWidthAccordingToColumsNumber() {
        switch(this.numberOfColumns) {
            case 9:  
                this.tablethwidth = "11.7%";
                this.tabletdwidth = "11.6%";
            break
            case 4:  
                this.tablethwidth = "31.3%";
                this.tabletdwidth = "31.2%";
            break
        }
    }
    
    ngOnInit() {
        let schemeName = this.activeRouter.snapshot.paramMap.get('schemeName');
        if (schemeName.includes('%20')) {
            schemeName = schemeName.replace('%20', ' ');
        }
        this.title = schemeName;
        this.model.getSchemesInfo().toPromise().then((sche) => {
            this.schemeMetadata = new SchemeMetadata(sche[this.title]);
            this.schemeMetadata.setupMetadata();
            this.numberOfColumns = this.schemeMetadata.numberOfColumns;
            this.accountTableWidthAccordingToColumsNumber();
            this.roleSorting = this.fillInTableService.fillSortingToSchemeTable(this.schemeMetadata);
            this.roleColumns = this.fillInTableService.fillColumnsToSchemeTable(this.title, this.schemeMetadata);
            this.roleRows = this.fillInTableService.fillRowsToSchemeTable(this.roleColumns, this.title, this.schemeMetadata);
        });
    }
    
    resetForm() {
        this.router.navigateByUrl("/");
    }
    
    roleInput(role?: object) {
        this.roleInputPopup.openModalDialog(role, this.title, this.schemeMetadata);
    }
    
    changeRolesOutputOnPage(event: object) {
        this.rolesReserve = JSON.parse(JSON.stringify(this.roleRows));
        this.tableContainer = new TableContainer(this.rolesReserve, Number.parseInt(event.toString()));
        this.roleRows = this.fillInTableService.fillRowsToRolesTableFromOutsideSource(this.tableContainer.getRolesOnPage(0), this.schemeMetadata);
        this.numberOfPages =  Number.parseInt(event.toString());
    }
    
    nextPageTabulate() {
        if(this.currentPageNumber < this.tableContainer.numberOfPages){
            this.roleRows = this.fillInTableService.fillRowsToRolesTableFromOutsideSource(this.tableContainer.getRolesOnPage(this.currentPageNumber),
                this.schemeMetadata);
            this.currentPageNumber++;
        }
    }
    
    previousPageTabulate() {
        if(this.currentPageNumber > 1){
            this.roleRows = this.fillInTableService.fillRowsToRolesTableFromOutsideSource(this.tableContainer.getRolesOnPage(this.currentPageNumber - 2), 
                this.schemeMetadata);
            this.currentPageNumber--;
        }
    }
    
    firstPageTabulate() {
        if(this.currentPageNumber > 1){
            this.roleRows = this.fillInTableService.fillRowsToRolesTableFromOutsideSource(this.tableContainer.getRolesOnPage(0), this.schemeMetadata);
            this.currentPageNumber = 1;
        }
    }
    
    lastPageTabulate() {
        if(this.currentPageNumber < this.tableContainer.numberOfPages){
            this.roleRows = this.fillInTableService.fillRowsToRolesTableFromOutsideSource(this.tableContainer.getRolesOnPage(this.tableContainer.numberOfPages - 1), 
                this.schemeMetadata);
            this.currentPageNumber = this.tableContainer.numberOfPages;
        }
    }
    
    filter(event: string) {
        let page = '';
        if (this.schemeMetadata.containsNestedProperties) {
            page = '{"ROLENAME":"' + event + '"}'; 
        } else {
            page = '{"Entity":"' + event + '"}';
        }    
            this.model.getObservableSchemeByFilter(page, this.title).toPromise().then((role) => {
                if (role["message"]) {
                    this.rolesReserve = [];
                    this.tableContainer = new TableContainer(this.rolesReserve, this.numberOfPages);
                    this.roleRows = this.fillInTableService.fillRolesByEmptyColumns();
                } else {
                    let rolesValues = Object.values(role["values"]);
                    this.rolesReserve = rolesValues;
                    this.tableContainer = new TableContainer(this.rolesReserve, this.numberOfPages); 
                    this.roleRows = this.fillInTableService.fillRowsToRolesTableFromOutsideSource(this.tableContainer.getRolesOnPage(0),
                        this.schemeMetadata);                   
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
                result = result + '{"' + el + '":"' + n + '"},';
            });
            
        }
        return result;
    }
    
    getRestrictivePreviousFilter(): string {
        let hasMoreThanOneFiltered = Object.keys(this.previousFilter).length > 1;
        let result = '';
        if (!hasMoreThanOneFiltered) {            
            for (let el in this.previousFilter) {
                this.previousFilter[el].forEach((n) => {
                    result = result + '{"' + el + '":"' + n + '"},';
                });            
            }
            result = result.replace(/.$/,"");
        } else {
            //need form query like this: [ {"Entity":"", "NOT Entity":["", "not entity 5"], "GBU":["MED","SU"]}]
            let filObj = this.previousFilter;
            let firstObj = Object.keys(filObj)[0];
            let firstObjVals = filObj[Object.keys(filObj)[0]];
            firstObjVals.forEach((foVals) => {
                result = result + '{"' + firstObj + '":"' + foVals + '",';
                Object.keys(filObj).filter(function(k, i) {
                    return i >= 1 && i < Object.keys(filObj).length;
                    }).forEach(function(k) {
                        result = result + '"' + k + '":[';
                        filObj[k].forEach((r) => {
                            result = result + '"' + r + '",';
                        });
                        result = result.replace(/.$/,"]");
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
        page = page + this.getRestrictivePreviousFilter() + "]";

        this.model.getObservableSchemeByFilter(page, this.title).toPromise()
            .then((role) => {
                if (role["message"]) {
                    this.rolesReserve = [];
                    this.tableContainer = new TableContainer(this.rolesReserve, this.numberOfPages);
                    this.roleRows = this.fillInTableService.fillRolesByEmptyColumns();
                } else {
                    let rolesValues = Object.values(role["values"]);
                    this.rolesReserve = rolesValues;
                    this.tableContainer = new TableContainer(this.rolesReserve, this.numberOfPages); 
                    this.roleRows = this.fillInTableService.fillRowsToRolesTableFromOutsideSource(this.tableContainer.getRolesOnPage(0),  this.schemeMetadata);                   
                }                
                this.currentPageNumber = 1;
            }).catch((response) => this.checkError(response));
    }
}
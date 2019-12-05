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
    @ViewChild(RoleInputPopupComponent, {static: false}) roleInputPopup:RoleInputPopupComponent;
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
    tableNumberOfColumns: number;
    previousFilter: object = {};
    
    tableContainer: TableContainer;
    rolesReserve: object[] = [];
    
    levels:Array<Object> = [
        {num: 0, name: "All"},
        {num: 100, name: "100"},
        {num: 50, name: "50"},
        {num: 10, name: "10"}
    ];
    
    fileForUpload: File;
    uploadError: string = "error message";
    
    constructor(private model: Model, private router: Router, private activeRouter: ActivatedRoute, private fillInTableService: FillInTableService) {        
        this.currentPageNumber = 1; 
        this.numberOfPages = 100;
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
            this.tableNumberOfColumns = this.schemeMetadata.numberOfColumns;
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
        if (event.toString() === "All") {
            window.location.reload();
        } else {
            this.rolesReserve = JSON.parse(JSON.stringify(this.roleRows));
            this.tableContainer = new TableContainer(this.rolesReserve, Number.parseInt(event.toString()));
            this.roleRows = this.fillInTableService.fillRowsToRolesTableFromOutsideSource(this.tableContainer.getRolesOnPage(0), this.schemeMetadata);
            this.numberOfPages =  Number.parseInt(event.toString());
        }
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
            page = page + '{'
            for (let el in this.schemeMetadata.scheme) {                
                if (this.schemeMetadata.scheme[el]["primarySearch"]) {
                    if (page !== '{') {
                        page = page + ',';
                    }
                    page = page + '"' + el + '":"' + event + '"';
                }
            }        
            page = page + '}';
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
    
    downloadScheme() {
        this.model.downloadScheme(this.title);
    }
    
    uploadScheme(event) {
        this.model.uploadScheme(this.fileForUpload, this.title).toPromise().then((data) => {
            if(data["errors"].length !== 0) {
                this.uploadError = "Upload Table Error: " + data["errors"][0].__ValidationErrors;
            } else {
                this.uploadError = "error message";
            }
        }).catch((response) => this.uploadError = response);
    }
    
    selectSchemeForUpload(event: any) {
        this.fileForUpload = event.target.files[0];
        if (!this.fileForUpload) {
            this.fileForUpload = event.srcElement.files[0];
        }
        
    }
}
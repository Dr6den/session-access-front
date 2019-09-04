import { Component, Inject, OnInit } from "@angular/core";
import { IOption } from 'ng-select';
import { NgForm } from "@angular/forms";
import { Role } from "../model/role.model";
import { Model } from "../model/repository.model";
import { ActivatedRoute, Router } from "@angular/router";
import { RoleUpdate } from "../model/roleUpdate.model";

@Component({
    selector: "roleEditor",
    templateUrl: "create.role.form.component.html",
    styleUrls: ["create.role.form.component.css"]
})
export class CreateRoleFormComponent implements OnInit {
    role = new Role();
    reservedRole = new Role();
    accessDropdownList = [];
    gbuDropdownList = [];
    regionDropdownList = [];
    cogsDropdownList = [];
    
    accessSelectedItems = [];
    gbuSelectedItems = [];
    regionSelectedItems = [];
    cogsSelectedItems = [];
    
    dropdownSettings = {};
    dropdownMultiSettings = {};
    title = "";
    errorMessage = "error message";
    errorTextColor: string = "darkturquoise";
    
    constructor(private model: Model, activeRoute: ActivatedRoute, private router: Router) {
        if(activeRoute.snapshot.params["rolename"] === undefined) {            
            this.title = "Create Role";
        } else {
        
            this.reservedRole.ROLENAME = activeRoute.snapshot.params["rolename"];
        //-------please delete it 
            this.reservedRole.ACCESS = (new String(activeRoute.snapshot.params["access"])).replace(/"/g,'').split(",");
            let GBUparam = (new String(activeRoute.snapshot.params["gbu"]));
            this.reservedRole.GBU = GBUparam.substring(GBUparam.lastIndexOf("[") + 2, GBUparam.lastIndexOf("]") - 1).replace(/"/g,'').split(",");
            let regionParam = (new String(activeRoute.snapshot.params["region"]));
            this.reservedRole.REGION = regionParam.substring(regionParam.lastIndexOf("[") + 2, regionParam.lastIndexOf("]") - 1).replace(/"/g,'').split(",");
            this.reservedRole.COGS = (new String(activeRoute.snapshot.params["cogs"])).replace(/"/g,'').split(",");
        //-------please delete it
            let options = activeRoute.snapshot.params["options"];
            if(options) {
                let splitedOptions: string[] = options.split("-");
                this.reservedRole.ACCESS = this.getStringFromArrayOfStringsThatIncludesName(splitedOptions, "ACCESS").replace(/"/g,'').split(",");
                let GBUparam = this.getStringFromArrayOfStringsThatIncludesName(splitedOptions, "GBU");
                this.reservedRole.GBU = GBUparam/*.substring(GBUparam.lastIndexOf("[") + 2, GBUparam.lastIndexOf("]") - 1).replace(/"/g,'')*/.split(",");
                let RegionParam = this.getStringFromArrayOfStringsThatIncludesName(splitedOptions, "REGION");
                this.reservedRole.REGION = RegionParam/*.substring(RegionParam.lastIndexOf("[") + 2, RegionParam.lastIndexOf("]") - 1).replace(/"/g,'')*/.split(",");
                this.reservedRole.COGS = this.getStringFromArrayOfStringsThatIncludesName(splitedOptions, "COGS").replace(/"/g,'').split(",");
            }
            this.title = "Edit Role";    
        }
        this.getRoleData();
    }
    
    getStringFromArrayOfStringsThatIncludesName(arr: string[], part: string): string {
        let result: string = '';
        result = arr.find(function(element) {
          return element.includes(part);
        });
        return result.substring(result.indexOf(":") + 2);
    }
    
    parseSelectedItem(item: Array<string>):Array<string> {
        let parsedSi = item.map((element) => {
            let elementStringified = JSON.stringify(element);
            return elementStringified.substring(elementStringified.lastIndexOf(":") + 2, elementStringified.lastIndexOf("}") - 1);;
        });
        return parsedSi;
    }
                
    getRoleData() {
        this.model.getRole().subscribe(data => {
			if ((data != undefined)) {
                            this.role = data;
                            this.setUpDropdowns();
			}
                    });
    }
    
    findIdOfDropdownElement(arr: Array<any>, val:String) {
        return arr.find((item)=>item.item_text===val).item_id;
    }

    setUpDropdowns() {
                            let elnum = 0;
                            //filling in access dropdown from role access
                            this.accessDropdownList = this.role.ACCESS.map(value => {return {item_id: elnum++, item_text: value}});
                            //filling in gbu dropdown from role access
                            elnum = 0;
                            this.gbuDropdownList = this.role.GBU.map(value => {return {item_id: elnum++, item_text: value}});
                            //filling in region dropdown from role access
                            elnum = 0;
                            this.regionDropdownList = this.role.REGION.map(value => {return {item_id: elnum++, item_text: value}});
                            //filling in cogs dropdown from role access
                            elnum = 0;
                            this.cogsDropdownList = this.role.COGS.map(value => {return {item_id: elnum++, item_text: value}});

                            //filling selected dropdown items for all 4 dropdowns, default selected items for create mode, and selected from database with edit mode
                            if (this.title === "Create Role") {
                                this.accessSelectedItems = [{item_id: 0, item_text: this.role.ACCESS[0]}];                            
                                this.gbuSelectedItems = [{item_id: 0, item_text: this.role.GBU[0]}];
                                this.regionSelectedItems = [{item_id: 0, item_text: this.role.REGION[0]}];                            
                                this.cogsSelectedItems = [{item_id: 0, item_text: this.role.COGS[0]}];
                            } else {
                                this.accessSelectedItems = this.reservedRole.ACCESS.map(value => 
                                    {return {item_id: this.findIdOfDropdownElement(this.accessDropdownList, value), item_text: value}});
                                this.gbuSelectedItems = this.reservedRole.GBU.map(value => 
                                    {return {item_id: this.findIdOfDropdownElement(this.gbuDropdownList, value), item_text: value}});
                                this.regionSelectedItems = this.reservedRole.REGION.map(value => 
                                    {return {item_id: this.findIdOfDropdownElement(this.regionDropdownList, value), item_text: value}});
                                this.cogsSelectedItems = this.reservedRole.COGS.map(value => 
                                    {return {item_id: this.findIdOfDropdownElement(this.cogsDropdownList, value), item_text: value}});
                            }
                            //role is erasing, avoid erasure
                            this.role.ROLENAME = this.reservedRole.ROLENAME;
    }
    
    ngOnInit() {        
        this.dropdownSettings = {
            singleSelection: true,
            idField: 'item_id',
            textField: 'item_text',
            enableCheckAll: false,
            itemsShowLimit: 9,
            allowSearchFilter: false
        };
        
        this.dropdownMultiSettings = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            enableCheckAll: false,
            itemsShowLimit: 9,
            allowSearchFilter: false
        };
    }
    onGBUItemSelect(item: any) {
        if (item.item_text === "ALL" || this.gbuSelectedItems.some((item) => {return item.item_text === "ALL";})) {
            this.gbuSelectedItems =  JSON.parse('[{"item_id":0,"item_text":"ALL"}]');
        }
    }
    onRegionItemSelect(item: any) {
        if (item.item_text === "ALL" || this.regionSelectedItems.some((item) => {return item.item_text === "ALL";})) {
            this.regionSelectedItems = JSON.parse('[{"item_id":0,"item_text":"ALL"}]');
        }
    }

    submitForm(form: NgForm) {
        if (form.valid) {
            let editedRole = new Role();
            editedRole.ROLENAME = this.role.ROLENAME;
            editedRole.ACCESS = this.parseSelectedItem(this.accessSelectedItems);
            editedRole.GBU = this.parseSelectedItem(this.gbuSelectedItems);
            editedRole.REGION = this.parseSelectedItem(this.regionSelectedItems);
            editedRole.COGS = this.parseSelectedItem(this.cogsSelectedItems);
            
            if (this.title === "Edit Role") {
                let roleUpdate = new RoleUpdate(this.reservedRole, editedRole);
                this.model.updateRole(roleUpdate).toPromise().then(() => this.router.navigateByUrl("/")).catch((response) => this.checkError(response));
            } else {
                this.model.insertRole(editedRole).toPromise().then(() => this.router.navigateByUrl("/")).catch((response) => this.checkError(response));
            }
        }
    }
    
    checkError(errorCode: number) {
        this.errorTextColor = "red";
        if (errorCode === 404) {
            this.errorMessage = "Schema doesn't exist";            
        } else if (errorCode === 400) {
            this.errorMessage = "Schema is not specified";
        } else if (errorCode === 500) {
            this.errorMessage = "Unknown error";
        } else if (errorCode === 409) {
            this.errorMessage = "Record already exist";
        }
    }

    resetForm() {
        this.getRoleData();
    }
    
    goHome() {
        this.router.navigateByUrl("/");
    }
}

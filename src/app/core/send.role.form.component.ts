import { Component, Inject, OnInit } from "@angular/core";
import { IOption } from 'ng-select';
import { NgForm } from "@angular/forms";
import { Role } from "../model/role.model";
import { Model } from "../model/repository.model";
import { ActivatedRoute, Router } from "@angular/router";
import { RoleUpdate } from "../model/roleUpdate.model";

@Component({
    selector: "paForm",
    templateUrl: "send.role.form.component.html",
    styleUrls: ["send.role.form.component.css"]
})
export class SendRoleFormComponent implements OnInit {
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
            this.reservedRole.ACCESS = (new String(activeRoute.snapshot.params["access"])).split(",");
            this.reservedRole.GBU = (new String(activeRoute.snapshot.params["gbu"])).split(",");
            this.reservedRole.REGION = (new String(activeRoute.snapshot.params["region"])).split(",");
            this.reservedRole.COGS = (new String(activeRoute.snapshot.params["cogs"])).split(",");
            this.title = "Edit Role";            
        }
        this.getRoleData();
    }
    
    parseSelectedItem(item: Array<string>):Array<string> {
        let parsedSi = item.map((element) => {
            let elementStringified = JSON.stringify(element);
            let cutedElementWithoutDropdownTags = elementStringified.substring(elementStringified.lastIndexOf(":") + 2, elementStringified.lastIndexOf("}") - 1);
            return cutedElementWithoutDropdownTags;//.replace(/\[\\\"/g,'').replace(/\\\"]/g,'').replace(/\\\"/g,'');
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
    
    setUpDropdowns() {
        let elnum = 0;
                            //filling in access dropdown from role access
                            this.accessDropdownList = this.role.ACCESS.map(value => {return {item_id: elnum++, item_text: value}});
                            this.accessSelectedItems = [{item_id: 0, item_text: this.role.ACCESS[0]}];
                            //filling in gbu dropdown from role access
                            elnum = 0;
                            this.gbuDropdownList = this.role.GBU.map(value => {return {item_id: elnum++, item_text: value}});
                            this.gbuSelectedItems = [{item_id: 0, item_text: this.role.GBU[0]}];
                            //filling in region dropdown from role access
                            elnum = 0;
                            this.regionDropdownList = this.role.REGION.map(value => {return {item_id: elnum++, item_text: value}});
                            this.regionSelectedItems = [{item_id: 0, item_text: this.role.REGION[0]}];
                            //filling in cogs dropdown from role access
                            elnum = 0;
                            this.cogsDropdownList = this.role.COGS.map(value => {return {item_id: elnum++, item_text: value}});
                            this.cogsSelectedItems = [{item_id: 0, item_text: this.role.COGS[0]}];
                            //role is erasing, avoid erasure
                            this.role.ROLENAME = this.reservedRole.ROLENAME;
    }
    
    ngOnInit() {        
        this.dropdownSettings = {
            singleSelection: true,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 6,
            allowSearchFilter: false
        };
        
        this.dropdownMultiSettings = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 6,
            allowSearchFilter: false
        };
    }
    onItemSelect(item: any) {
        //console.log(item);
    }
    onSelectAll(items: any) {
       // console.log(items);
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
                let roleUpdate = new RoleUpdate(this.reservedRole, this.role);
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

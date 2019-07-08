import { Component, Inject, OnInit } from "@angular/core";
import { IOption } from 'ng-select';
import { NgForm } from "@angular/forms";
import { Role } from "../model/role.model";
import { Model } from "../model/repository.model";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: "paForm",
    templateUrl: "send.role.form.component.html",
    styleUrls: ["send.role.form.component.css"]
})
export class SendRoleFormComponent implements OnInit {
    role = new Role();
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
    
    constructor(private model: Model, activeRoute: ActivatedRoute, private router: Router) {
        if(activeRoute.snapshot.params["rolename"] === undefined) {
            this.getRoleData();
            this.title = "Create Role";
        } else {
            this.role.ROLENAME = activeRoute.snapshot.params["rolename"];
            this.role.ACCESS = (new String(activeRoute.snapshot.params["access"])).split(",");
            this.role.GBU = (new String(activeRoute.snapshot.params["gbu"])).split(",");
            this.role.REGION = (new String(activeRoute.snapshot.params["region"])).split(",");
            this.role.COGS = (new String(activeRoute.snapshot.params["cogs"])).split(",");
            this.setUpDropdowns();
            this.title = "Edit Role";
        }
    }
    
    parseSelectedItem(item: Array<string>):Array<string> {
        let parsedSi = item.map((element) => {
            let elementStringified = JSON.stringify(element);
            return elementStringified.substring(elementStringified.lastIndexOf(":") + 2, elementStringified.lastIndexOf("}") - 1);
        })
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
                this.model.updateRole(editedRole).subscribe(
                    (val) => {
                    /*console.log("POST call successful value returned in body",
                        val);*/
                    },
                    response => {
                    //console.log("POST call in error", response);
                    },
                    () => {
                    //console.log("The POST observable is now completed.");
                    });
            } else {
                this.model.insertRole(editedRole).subscribe(
                    (val) => {
                    /*console.log("POST call successful value returned in body",
                        val);*/
                    },
                    response => {
                    //console.log("POST call in error", response);
                    },
                    () => {
                    //console.log("The POST observable is now completed.");
                    });
            }
            this.router.navigateByUrl("/");
        }
    }

    resetForm() {
        this.getRoleData();
    }
    
    goHome() {
        this.router.navigateByUrl("/");
    }
}

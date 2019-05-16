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
    
    constructor(private model: Model, activeRoute: ActivatedRoute, private router: Router) {
        this.getRoleData();
    }
                
    getRoleData() {
        this.model.getRoles().subscribe(data => {
			if ((data != undefined)) {
                            this.role = data;
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
                    });
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
            editedRole.ACCESS = this.accessSelectedItems;
            editedRole.GBU = this.gbuSelectedItems;
            editedRole.REGION = this.regionSelectedItems;
            editedRole.COGS = this.cogsSelectedItems;

            this.model.saveRole(editedRole).subscribe(
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
            this.router.navigateByUrl("/");
        }
    }

    resetForm() {
        this.getRoleData();
    }
}

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
    accessOptions: Array<string>;
    cogs: Array<IOption>;
    
    constructor(private model: Model, activeRoute: ActivatedRoute, private router: Router) {
        this.getRoleData();
    }
                
    getRoleData() {
        this.model.getRoles().subscribe(data => {
			if ((data != undefined)) {
                            this.role = data;
                            let elnum = 0;
                            //filling in access dropdown from role access
                            this.accessDropdownList = this.role.access.map(value => {return {item_id: elnum++, item_text: value}});
                            this.accessSelectedItems = [{item_id: 0, item_text: this.role.access[0]}];
                            //filling in gbu dropdown from role access
                            this.gbuDropdownList = this.role.gbu.map(value => {return {item_id: elnum++, item_text: value}});
                            this.gbuSelectedItems = [{item_id: 0, item_text: this.role.gbu[0]}];
                            //filling in region dropdown from role access
                            this.regionDropdownList = this.role.region.map(value => {return {item_id: elnum++, item_text: value}});
                            this.regionSelectedItems = [{item_id: 0, item_text: this.role.region[0]}];
                            //filling in cogs dropdown from role access
                            this.cogsDropdownList = this.role.cogs.map(value => {return {item_id: elnum++, item_text: value}});
                            this.cogsSelectedItems = [{item_id: 0, item_text: this.role.cogs[0]}];
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
        console.log(item);
    }
    onSelectAll(items: any) {
        console.log(items);
    }

    submitForm(form: NgForm) {
        if (form.valid) {
            let editedRole = new Role();
	    
            this.model.saveRole(this.role);
            this.router.navigateByUrl("/");
        }
    }

    resetForm() {
        this.getRoleData();
    }
}

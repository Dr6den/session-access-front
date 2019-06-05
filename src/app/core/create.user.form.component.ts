import { Component, Inject } from "@angular/core";
import { Model } from "../model/repository.model";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "../model/user.model"
import { NgForm } from "@angular/forms";

@Component({
    selector: "paTable",
    templateUrl: "create.user.form.component.html",
    styleUrls: ["create.user.form.component.css"]
})
export class CreateUserComponent {
    user = new User();
    
    rolesDropdownList = [];
    selectedRolesItems = [];
    
    dropdownSettings = {};
    
    disableForm =  true;

    constructor(private model: Model, private router: Router) { 
        this.getRoleData();
    }
    
    toggleDisable() {
        this.disableForm = false;
    }
    
    getRoleData() {
        this.model.getUser().subscribe(data => {
			if ((data != undefined)) {
                            this.user = data;
                            let elnum = 0;
                            //filling in roles dropdown from user roles
                            this.rolesDropdownList = this.user.ROLES.map(value => {return {item_id: elnum++, item_text: value}});
                            this.selectedRolesItems = [{item_id: 0, item_text: this.user.ROLES[0]}];
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
    }
    
    onItemSelect(item: any) {
        //console.log(item);
    }
    onSelectAll(items: any) {
       // console.log(items);
    }

    submitForm(form: NgForm) {
        if (form.valid) {
            let editedUser = new User();
            editedUser = this.user;
            editedUser.ROLES = this.selectedRolesItems;
            
            this.model.saveUser(editedUser).subscribe(
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
        this.router.navigateByUrl("/");
    }
}

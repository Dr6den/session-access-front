import { Component, OnInit, Input } from '@angular/core';
import { Model } from "../../model/repository.model";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "../../model/user.model";
import { Role } from "../../model/role.model";
import { UserUpdate } from "../../model/userUpdate.model";

@Component({
  selector: 'user-input-popup',
  templateUrl: './user.input.popup.component.html',
  styleUrls: ['./user.input.popup.component.css']
})
export class UserInputPopupComponent {
    display='none';
    user = new User();
    reservedUser = new User();    
    rolesDropdownList = [];
    selectedRolesItems = [];    
    dropdownSettings = {};
    disableForm =  true;
    title = "";
    errorMessage = "error message";
    errorTextColor: string = "#FFFFFF";

    constructor(private model: Model, activeRoute: ActivatedRoute, private router: Router) {
        if(activeRoute.snapshot.params["name"] !== undefined) {
            this.user.USERNAME = activeRoute.snapshot.params["name"];
            this.toggleDisable();
            this.title = "Edit User";
            this.reservedUser = this.user;
        } else {
            this.title = "Create User";
        }
        
        this.getRoleData();
      
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            enableCheckAll: false,
            itemsShowLimit: 6,
            allowSearchFilter: false
        };
    }
    
    toggleDisable() {        
        this.getUserData(this.user.USERNAME);
        if (this.user) {
            this.disableForm = false;
        }
    }
    
    getUserData(username: string) {
        this.model.getUser(username).subscribe(data => {
			if ((data != undefined)) {
                            this.user.USERID = data.USERID;
                            this.user.NTSID = data.NTSID;
                            this.user.NTDOMAINSID = data.NTDOMAINSID;                            
			}
                    });
    }
    
    getRoleData() {
        let elnum = 0;
        let rolesDropdown = [];
        this.model.getObservableRoles().toPromise()
            .then((roles) => {roles.forEach((role) => {                                
                rolesDropdown.push({item_id: elnum++, item_text: role.ROLENAME});
            });
            this.rolesDropdownList = rolesDropdown;
            this.selectedRolesItems = [{item_id: 0, item_text: this.rolesDropdownList[0].item_text}];
        });
    }
    
    openModalDialog(){
        this.display='block'; //Set block css
    }

    closeModalDialog(){
        this.display='none'; //set none css after close dialog
    }
}
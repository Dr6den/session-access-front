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
    }
    
    toggleDisable() {        
        this.getUserData(this.user.USERNAME);console.log(this.user);
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
                    });console.log(this.user);
    }
    
    getRoleData() {
        let rolesDescription: Array<Role> = this.model.getRolesArray();
        let elnum = 0;
        //filling in roles dropdown from user roles
        /*this.rolesDropdownList = rolesDescription.map(value => {return {item_id: elnum++, item_text: value.ROLENAME}});
        this.selectedRolesItems = [{item_id: 0, item_text: rolesDescription[0].ROLENAME}];*/
    }
    
    openModalDialog(){
        this.display='block'; //Set block css
    }

    closeModalDialog(){
        this.display='none'; //set none css after close dialog
    }
}
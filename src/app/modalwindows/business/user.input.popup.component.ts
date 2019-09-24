import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from "@angular/forms";
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
        this.getRoleData();
      
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            enableCheckAll: false,
            itemsShowLimit: 100,
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
                rolesDropdown.push(role["ROLENAME"] + " | " + role["Application"]);
            });
            this.rolesDropdownList = rolesDropdown;
        });
    }
    
    openModalDialog(user?: User) {
        if (user) {
            this.title = "Edit User";
            this.user.USERNAME = user.USERNAME;
            this.toggleDisable();
            this.reservedUser = this.user;
            this.selectedRolesItems = [];
            user["Role"].forEach((role) => {
                for (let el of this.rolesDropdownList) {
                    if(el.startsWith(role)) {
                        this.selectedRolesItems.push(el);
                        break;
                    }
                }
            });
        } else {
            this.getRoleData();
            this.selectedRolesItems = [];
            this.selectedRolesItems.push(this.rolesDropdownList[0].item_text);
            this.title = "Create User";
        }
        this.display='block';
    }

    closeModalDialog(){
        this.display='none';
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
    
    parseSelectedItem(item: Array<string>):Array<string> {
        let parsedSi = item.map((element) => {
            return element.substring(0, element.indexOf("|") -1);
        });
        return parsedSi;
    }
    
    submitForm(form: NgForm) {
        if (form.valid) {
            let editedUser = new User();
            editedUser = this.user;
            editedUser.ROLES = this.parseSelectedItem(this.selectedRolesItems);
       
            if (this.title === "Edit User") {
                let userUpdate = new UserUpdate(this.reservedUser, this.user);
                this.model.updateUser(userUpdate).toPromise().then().catch((response) => this.checkError(response));
            } else {
                this.model.insertUser(editedUser).toPromise().then().catch((response) => this.checkError(response));
            }
            this.closeModalDialog();
            window.location.reload();
        }
    }
    
    onItemSelect(item: any) {
        //console.log(item);
    }
    onSelectAll(items: any) {
       // console.log(items);
    }
}
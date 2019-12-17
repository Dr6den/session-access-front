import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Model } from "../../model/repository.model";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "../../model/user.model";
import { Role } from "../../model/role.model";
import { UserUpdate } from "../../model/userUpdate.model";
import { ShortRole } from "../../model/short.role.model";

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
        this.model.getUser(username).toPromise().then(data => {
			if ((data != undefined)) {
                            this.user.USERID = data[0].USERID;
                            this.user.NTSID = data[0].NTSID;
                            this.user.USEREMAIL = data[0].USEREMAIL;
                            this.user.NTDOMAINSID = data[0].NTDOMAINSID;                          
			}
                        this.errorMessage = "error message";
                    }).catch((response) => this.checkError(response));;
    }
    
    getRoleData() {
        let elnum = 0;
        let rolesDropdown = [];
        this.model.getObservableRoles().toPromise()
            .then((roles) => {let vals = Object.values(roles["values"]);
                vals.forEach((role) => {
                    rolesDropdown.push(role["Application"] + " : " +  role["ROLENAME"]);
                });
            this.rolesDropdownList = rolesDropdown;
        });
    }
    
    openModalDialog(user?: User) {
        if (user) {
            this.title = "Edit User";
            this.user.USERNAME = user.USERNAME;
            this.user.USERID = user.USERID;
            this.user.NTSID = user.NTSID;
            this.user.NTDOMAINSID = user.NTDOMAINSID;
            //we have send data for template table, it works for templates only
            if (user["__TemporaryId"]) {
                this.user["__TemporaryId"] = user["__TemporaryId"];
                this.user["_id"] = user["_id"];
            }
            
            this.toggleDisable();
            this.reservedUser = this.user;
            this.selectedRolesItems = [];
            let roles:string[] = user["Role"].split(", ");
            roles.forEach((role) => {
                for (let el of this.rolesDropdownList) {
                    if(el === role) {
                        this.selectedRolesItems.push(el);
                        break;
                    }
                }
            });
        } else {
            this.user.USERNAME = "";
            this.user.USERID = "";
            this.user.NTSID = "";
            this.user.NTDOMAINSID = "";
            this.user.USEREMAIL = "";
            this.getRoleData();
            this.selectedRolesItems = [];
            this.selectedRolesItems.push(this.rolesDropdownList[0]);
            this.title = "Create User";
        }
        this.display='block';
        this.errorMessage = "error message";
    }

    closeModalDialog(){
        this.display='none';
    }
    
    checkError(errorCode: object) {
        this.errorMessage = errorCode.toString();
    }
    
    parseSelectedItem(item: Array<string>):Array<ShortRole> {
        let result: ShortRole[] = [];
        item.map((element) => {
            let application = element.substring(0, element.indexOf(":") - 1);
            let role = element.substring(element.indexOf(":") + 2);
            result.push(new ShortRole(role, application));
        });
        return result;
    }
    
    submitForm(form: NgForm) {
        if (form.valid) {
            let editedUser = new User();
            editedUser = this.user;
            editedUser.ROLES = this.parseSelectedItem(this.selectedRolesItems);
    
            if (editedUser["__TemporaryId"]) {//another endpoint esspecially for the temporary tables
                this.user["__Schema"]="Users";
                let userUpdate = new UserUpdate(this.reservedUser, this.user);
                this.model.updateElemFromTemporaryScheme(userUpdate).toPromise().then().catch((response) => this.checkError(response));
            } else if (this.title === "Edit User") {
                let userUpdate = new UserUpdate(this.reservedUser, this.user);
                this.model.updateUser(userUpdate).toPromise().then().catch((response) => this.checkError(response));
            } else {
                this.model.insertUser(editedUser).toPromise().then().catch((response) => this.checkError(response));
            }
            if (this.errorMessage === "error message") {
                this.closeModalDialog();
                window.location.reload();
            }
        }
    }
    
    onItemSelect(item: any) {
        //console.log(item);
    }
    onSelectAll(items: any) {
       // console.log(items);
    }
}
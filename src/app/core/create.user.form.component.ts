import { Component, Inject } from "@angular/core";
import { Model } from "../model/repository.model";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "../model/user.model"
import { NgForm } from "@angular/forms";
import { Role } from "../model/role.model";
import { UserUpdate } from "../model/userUpdate.model";

@Component({
    selector: "userEditor",
    templateUrl: "create.user.form.component.html",
    styleUrls: ["create.user.form.component.css"]
})
export class CreateUserComponent {
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
            this.title = "Edit Data";
            this.reservedUser = this.user;
        } else {
            this.title = "Create Data";
        }
        
        this.getRoleData();
    }
    
    parseSelectedItem(item: Array<string>):Array<string> {
        let parsedSi = item.map((element) => {
            let elementStringified = JSON.stringify(element);
            return elementStringified.substring(elementStringified.lastIndexOf(":") + 2, elementStringified.lastIndexOf("}") - 1);
        })
        return parsedSi;
    }
    
    toggleDisable() {
        this.disableForm = false;
        this.getUserData(this.user.USERNAME);
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
        let rolesDescription: Array<Role> = this.model.getRolesArray();
        let elnum = 0;
        //filling in roles dropdown from user roles
        this.rolesDropdownList = rolesDescription.map(value => {return {item_id: elnum++, item_text: value.ROLENAME}});
        this.selectedRolesItems = [{item_id: 0, item_text: rolesDescription[0].ROLENAME}];
    }
    
    ngOnInit() {        
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            enableCheckAll: false,
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
            editedUser.ROLES = this.parseSelectedItem(this.selectedRolesItems);
       
            if (this.title === "Edit Data") {
                let userUpdate = new UserUpdate(this.reservedUser, this.user);
                this.model.updateUser(userUpdate).toPromise().then(() => this.router.navigateByUrl("/")).catch((response) => this.checkError(response));
            } else {
                this.model.insertUser(editedUser).toPromise().then(() => this.router.navigateByUrl("/")).catch((response) => this.checkError(response));
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
        this.router.navigateByUrl("/");
    }
    
    goHome() {
        this.router.navigateByUrl("/");
    }
}

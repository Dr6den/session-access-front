import { Component, Inject, NgModule } from "@angular/core";
import { Router } from "@angular/router";
import { Model } from "../model/repository.model";
import { Role } from "../model/role.model";

@Component({
    selector: "rolesTable",
    templateUrl: "roles.table.component.html",
    styleUrls: ["roles.table.component.css"]
})
export class RolesTableComponent {
    public popoverTitle: string = 'Delete the role';
    public popoverMessage: string = 'Are you sure you want delete the role?';
    public cancelClicked: boolean = false;

    constructor(private model: Model, private router: Router) {
        this.model.getRoles();
    }

    getItems(): Array<Role> {
        return this.model.getRolesArray();
    }
    
    resetForm() {
        this.router.navigateByUrl("/");
    }

    deleteItem(item: Role) {
 	this.model.deleteRole(item);
	window.location.reload();
    }
}
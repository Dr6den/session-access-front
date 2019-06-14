import { Component, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { Model } from "../model/repository.model";
import { Role } from "../model/role.model";

@Component({
    selector: "paTable",
    templateUrl: "roles.table.component.html",
    styleUrls: ["roles.table.component.css"]
})
export class RolesTableComponent {

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
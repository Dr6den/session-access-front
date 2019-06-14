import { Component, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { Model } from "../model/repository.model";
import { User } from "../model/user.model";

@Component({
    selector: "paTable",
    templateUrl: "users.table.component.html",
    styleUrls: ["users.table.component.css"]
})
export class UsersTableComponent {

    constructor(private model: Model, private router: Router) {
        this.model.getUsers();
    }

    getItems(): Array<User> {
        return this.model.getUsersArray();
    }
    
    resetForm() {
        this.router.navigateByUrl("/");
    }
    
    deleteItem(item: User) {
 	this.model.deleteUser(item);
	window.location.reload();
    }
}

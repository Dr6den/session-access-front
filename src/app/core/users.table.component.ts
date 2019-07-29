import { Component, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { Model } from "../model/repository.model";
import { User } from "../model/user.model";

@Component({
    selector: "usersTable",
    templateUrl: "users.table.component.html",
    styleUrls: ["users.table.component.css"]
})
export class UsersTableComponent {
    public popoverTitle: string = 'Delete the user';
    public popoverMessage: string = 'Are you sure you want delete the user?';
    public cancelClicked: boolean = false;

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

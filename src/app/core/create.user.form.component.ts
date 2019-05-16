import { Component, Inject } from "@angular/core";
import { Model } from "../model/repository.model";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: "paTable",
    templateUrl: "create.user.form.component.html",
    styleUrls: ["create.user.form.component.css"]
})
export class CreateUserComponent {

    constructor(private model: Model, private router: Router) { }

    resetForm() {
        this.router.navigateByUrl("/");
    }
}

import { Component, Inject } from "@angular/core";
import { Model } from "../model/repository.model";

@Component({
    selector: "paTable",
    templateUrl: "index.component.html",
    styleUrls: ["index.component.css"]
})
export class IndexComponent {

    constructor(private model: Model) { }

}

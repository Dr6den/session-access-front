import { Component, Inject } from "@angular/core";
import { Model } from "../model/repository.model";
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
@Component({
    selector: "paTable",
    templateUrl: "index.component.html",
    styleUrls: ["index.component.css"]
})
export class IndexComponent {
     public title: string = "Directories";
     public dictionariesTypes: string[] = [];
     
     constructor(private model: Model) {
         
     }
     
     ngOnInit() {
         this.model.getSchemesList().toPromise().then(data => {
                this.dictionariesTypes = data;
            });
     }
}

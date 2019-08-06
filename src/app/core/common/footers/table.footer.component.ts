import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: "table-footer",
    templateUrl: "table.footer.component.html",
    styleUrls: ["table.footer.component.css"]
})
export class TableFooterComponent {
    @Input("numrecords") numrecords: number;
    @Input("shown") shown: number;

    constructor(private activeRoute: ActivatedRoute, private router: Router) {

    }
   
}

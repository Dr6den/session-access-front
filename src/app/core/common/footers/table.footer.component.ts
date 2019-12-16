import { Component, Input } from "@angular/core";

@Component({
    selector: "table-footer",
    templateUrl: "table.footer.component.html",
    styleUrls: ["table.footer.component.css"]
})
export class TableFooterComponent {
    @Input("numrecords") numrecords: number;
    @Input("shown") shown: number;

}

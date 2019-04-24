import { Component, Inject } from "@angular/core";
import { Tasklist } from "../model/tasklist.model";
import { Task } from "../model/task.model";
import { Model } from "../model/repository.model";

@Component({
    selector: "paTable",
    templateUrl: "table.component.html"
})
export class TableComponent {

    constructor(private model: Model) { }

    getItems(): Array<Task> {
        return this.model.getItems();
    }

    deleteItem(item: Task) {
 	this.model.deleteTask(item);
	window.location.reload();
    }

    editItem(item: Task) {
    }
}

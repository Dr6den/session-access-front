import { Task } from "./task.model";

export class Tasklist {
    public items: Array<Task>;

    constructor(public tasks?: Array<Task>) {
	this.items = tasks;
    }

    getItems(): Array<Task> {
        return this.items;
    }
}

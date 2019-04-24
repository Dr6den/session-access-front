import { Injectable } from "@angular/core";
import { Tasklist } from "./tasklist.model";
import { Task } from "./task.model";
import { Observable, Subscription } from "rxjs";
import { RestDataSource } from "./rest.datasource";
import { take, first, takeUntil, map } from 'rxjs/operators';

@Injectable()
export class Model {
    tasklist;
    executors = [];
    subscriptions = new Subscription();

    getTasklist(): void {
	this.dataSource.getTasklist().subscribe((data) => {
		if (data[0] != undefined) {
			this.tasklist = new Tasklist(data);
		}
	});
    }

    getItems(): Array<Task> {
	return this.tasklist.getItems();
    }

    constructor(private dataSource: RestDataSource) {     
	this.getTasklist();
    }

    getExecutors(): Observable<string[]> {
	return this.dataSource.getExecutors();
    }

    saveTask(task: Task) {
        this.dataSource.saveTask(task).subscribe();
    }

    deleteTask(task: Task) {
        this.dataSource.deleteTask(task.id).subscribe();
    }
}

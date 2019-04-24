import { Injectable, Inject, InjectionToken } from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Task } from "./task.model";
import { Tasklist } from "../model/tasklist.model";

export const REST_URL = new InjectionToken("rest_url");

@Injectable()
export class RestDataSource {
    constructor(private http: HttpClient,
        @Inject(REST_URL) private url: string) { }

    getTasklist(): Observable<Task[]> {
        let url = this.url + "/getTasklist";
        return this.sendRequest<Task[]>("GET", url);
    }

    getExecutors(): Observable<string[]> {
        let url = this.url + "/getExecutors";
        return this.sendRequest<string[]>("GET", url);
    }

    saveTask(task: Task): Observable<Task> {
	let url = this.url + "/saveTask/" + task.name;
        return this.sendRequest<Task>("PUT", url, task);
    }

    deleteTask(id: string): Observable<string> {
	let url = this.url + "/deleteTask/" + id;
        return this.sendRequest<string>("DELETE", url);
    }

    private sendRequest<T>(verb: string, url: string, body?: Task)
        : Observable<T> {

        let myHeaders = new HttpHeaders();
	if(verb == "POST") {
		myHeaders = myHeaders.set("Access-Control-Allow-Origin","*");
		myHeaders = myHeaders.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, DELETE");
		myHeaders = myHeaders.set("Access-Key", "<secret>");
		myHeaders = myHeaders.set("Application-Names", ["exampleApp", "pro"]);
	}
        return this.http.request<T>(verb, url, {
            body: body,
            headers: myHeaders
        }).pipe(catchError((error: Response) => 
            throwError(`Network Error: ${error.statusText} (${error.status})`)));
    }

}

import { Component, Inject, OnInit } from "@angular/core";
import { IOption } from 'ng-select';
import { NgForm } from "@angular/forms";
import { Task } from "../model/task.model";
import { Model } from "../model/repository.model";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";

@Component({
    selector: "paForm",
    templateUrl: "send.role.form.component.html",
    styleUrls: ["send.role.form.component.css"]
})
export class SendRoleFormComponent implements OnInit {
    dropdownList = [];
    selectedItems = [];
    dropdownSettings = {};
    ngOnInit() {
        this.dropdownList = [
            {item_id: 1, item_text: 'Mumbai'},
            {item_id: 2, item_text: 'Bangaluru'},
            {item_id: 3, item_text: 'Pune'},
            {item_id: 4, item_text: 'Navsari'},
            {item_id: 5, item_text: 'New Delhi'}
        ];
        this.selectedItems = [
            {item_id: 3, item_text: 'Pune'},
            {item_id: 4, item_text: 'Navsari'}
        ];
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 3,
            allowSearchFilter: true
        };
    }
    onItemSelect(item: any) {
        console.log(item);
    }
    onSelectAll(items: any) {
        console.log(items);
    }
    
    myOptions: Array<IOption> = [
        {label: 'Belgium', value: 'BE'},
        {label: 'Luxembourg', value: 'LU'},
        {label: 'Netherlands', value: 'NL'}
    ];
    /*task = new Task();
    executorsMap = new Map();

    constructor(private model: Model, activeRoute: ActivatedRoute,
                private router: Router) {

	if(activeRoute.snapshot.params["name"] === undefined) {
		this.task.name = "";
		this.task.startDate = new Date();
		this.task.endDate = new Date();
		this.model.getExecutors().subscribe(data => {
			if ((data[0] != undefined) && typeof data[0] == "string") {
				this.task.executors = Object.assign(new Array(), data);
				data.map(obj => this.executorsMap.set(obj, false));
			}
		});
	} else {
		this.task.name = activeRoute.snapshot.params["name"];
		this.task.startDate = activeRoute.snapshot.params["startDate"];
		this.task.endDate = activeRoute.snapshot.params["endDate"];
		let allOfExecutors = activeRoute.snapshot.params["executors"];
		this.model.getExecutors().subscribe(data => {
			if ((data[0] != undefined) && typeof data[0] == "string") {
				this.task.executors = Object.assign(new Array<string>(), data);
		 		this.task.executors.map(obj => {
					allOfExecutors.includes(obj) ?
						this.executorsMap.set(obj, true) :
						this.executorsMap.set(obj, false)});
			}
		});
	}
    }

    editing: boolean = false;

    submitForm(form: NgForm) {
        if (form.valid) {
	    let checkedExecutors = [];
            this.executorsMap.forEach( (key, val) => {
		if (key === true) {checkedExecutors.push(val);}
	    });

	    this.task.executors = checkedExecutors;
            this.model.saveTask(this.task);
	    this.model.getTasklist();
            this.router.navigateByUrl("/");
        }
    }

    resetForm() {
	this.model.getTasklist();
    }*/
}

import {Component, Input, ComponentFactory, ComponentRef, ComponentFactoryResolver, ViewContainerRef, ViewChild, Output, EventEmitter, OnInit} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser';
import { NgForm } from "@angular/forms";
import { FormBuilder, FormGroup, FormControl, Validators }  from '@angular/forms';
import { DynamicDropboxComponent } from './dynamic/dynamic.dropbox.component';
import { Model } from "../../model/repository.model";

@Component({
  selector: 'role-input-popup',
  templateUrl: './role.input.popup.component.html',
  styleUrls: ['./role.input.popup.component.css']
})
export class RoleInputPopupComponent implements OnInit {
    display='none'; //default Variable
    title = 'app';
    pagetitle = '';
    rolename = '';
    componentRef: ComponentRef<any>;
    role: object;
    processedRole: object;
    chosenApplication: object;
    appSelectedDropdownItems = [];
    applicationDropdownList: Array<string> = [];
    dropdownSettings = {};
    dropdownMultiSettings = {};
    errorMessage = "error message";
    errorTextColor: string = "#FFFFFF";

    @ViewChild('dropboxcontainer', { read: ViewContainerRef }) container;
    constructor(private resolver: ComponentFactoryResolver, private model: Model) {      
        this.getRoleData();       
    }
    
    ngOnInit() {        
        this.dropdownSettings = {
            singleSelection: true,
            idField: 'item_id',
            textField: 'item_text',
            enableCheckAll: false,
            itemsShowLimit: 9,
            allowSearchFilter: false
        };
        
        this.dropdownMultiSettings = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            enableCheckAll: false,
            itemsShowLimit: 9,
            allowSearchFilter: false
        };
    }
    
    openModalDialog(role?: object) {
        if (role) {console.log(JSON.stringify(role["Applications"]));
            this.pagetitle = "Edit Role";
            this.rolename = role["Rolename"];
            this.selectApplication(role["Applications"]);
            this.appSelectedDropdownItems = [];
            this.appSelectedDropdownItems.push(role["Applications"]);
        } else {
            this.appSelectedDropdownItems = [];
            this.rolename = "";
            this.clearComponents();
            this.pagetitle = "Create Role";
        }
        this.display='block';
    }

    closeModalDialog(){
        this.display='none';
    }
    
    clearComponents() {
        this.container.clear(); 
    }
    
    createComponent(title, entryValues) {
        if (entryValues[0] !== "text")  {      
            const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(DynamicDropboxComponent);
            this.componentRef = this.container.createComponent(factory);           
            this.componentRef.instance.title = title;
            this.componentRef.instance.dropdownList = entryValues[0];
            this.componentRef.instance.selectedItems = [];
            this.componentRef.instance.chosenSelectedItems.subscribe(data => {
                let appName:string = this.chosenApplication["Application"].values[0];
                this.processedRole[appName][title].values = data;
            });
            if (entryValues[1]) {
                this.componentRef.instance.dropdownSettings = {
                    singleSelection: false,
                    idField: 'item_id',
                    textField: 'item_text',
                    enableCheckAll: false,
                    itemsShowLimit: 9,
                    allowSearchFilter: false
                };
            } else {
                this.componentRef.instance.dropdownSettings = {
                    singleSelection: true,
                    idField: 'item_id',
                    textField: 'item_text',
                    enableCheckAll: false,
                    itemsShowLimit: 9,
                    allowSearchFilter: false
                };
            }
        }
    }
    
    destroyComponent() {
        this.componentRef.destroy();
    }
    
    getRoleData() {
        this.model.getRole().subscribe(data => {
            let applications: Array<string> = [];
            if ((data != undefined)) {
                this.role = data;
                this.processedRole = this.role;
                Object.entries(this.role).forEach(entry => applications.push(Object.values(entry)[0]));
                this.applicationDropdownList = applications;
            }
        });
    }
    
    onApplicationSelect(item: any) {            
        this.selectApplication(item);
    }
    
    selectApplication(item: any) {
        this.chosenApplication = this.role[item];
        this.clearComponents();
        Object.entries(this.chosenApplication).forEach(entry => {
            if (entry[0] !== "Application") {
                let entryValues = Object.values(this.chosenApplication[entry[0]]);
                this.createComponent(entry[0], entryValues);
            }
        });
    }
    
    submitForm(form: NgForm) {
        if (form.valid) {      
            if (this.title === "Edit User") {
                this.model.updateRole(this.processedRole).toPromise().then().catch((response) => this.checkError(response));
            } else {
                this.model.insertRole(this.processedRole).toPromise().then().catch((response) => this.checkError(response));
            }
            this.closeModalDialog();
            window.location.reload();
        }
    }
    
    checkError(errorCode: number) {
        this.errorTextColor = "red";
        if (errorCode === 404) {
            this.errorMessage = "Schema doesn't exist";            
        } else if (errorCode === 400) {
            this.errorMessage = "Schema is not specified";
        } else if (errorCode === 500) {
            this.errorMessage = "Unknown error";
        } else if (errorCode === 409) {
            this.errorMessage = "Record already exist";
        }
    }
}
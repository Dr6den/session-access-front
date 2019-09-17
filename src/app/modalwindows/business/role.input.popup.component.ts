import {Component, Input, ComponentFactory, ComponentRef, ComponentFactoryResolver, ViewContainerRef, ViewChild, Output, EventEmitter, OnInit} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser';
import { NgForm } from "@angular/forms";
import { FormBuilder, FormGroup, FormControl, Validators }  from '@angular/forms';
import { DynamicDropboxComponent } from './dynamic/dynamic.dropbox.component';
import { Model } from "../../model/repository.model";
import { Role } from "../../model/role.model";
import { RoleUpdate } from "../../model/roleUpdate.model";

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
    dataRecievedFromRolesTableScreen: Role;
    role: object;
    previousRequest: object;
    processedRole: object;
    chosenApplication: object;
    appSelectedDropdownItems = [];
    applicationDropdownList: Array<string> = [];
    dropdownSettings = {};
    dropdownMultiSettings = {};
    rolesOwnedOptions;
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
        if (role) {
            this.dataRecievedFromRolesTableScreen = new Role(role);
            this.previousRequest = role;
            this.pagetitle = "Edit Role";
            this.rolename = role["Rolename"];
            this.selectApplication(role["Applications"]);
            this.appSelectedDropdownItems = [];
            this.appSelectedDropdownItems.push(role["Applications"]);            
        } else {
            this.dataRecievedFromRolesTableScreen = new Role();
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
            //if role received from edit talbe (Edit mode) we have to set seted properties that are choosen
            if (this.dataRecievedFromRolesTableScreen.rolename) {
                let opts = this.dataRecievedFromRolesTableScreen.roleObj["Options"];
                for (let el of opts) {                    
                    if (el.startsWith(title)) {
                        let selectedRolesArray = el.substring(el.indexOf(":") + 2).split(",");
                        selectedRolesArray.forEach((r) => this.componentRef.instance.selectedItems.push(r));
                        break;
                    }
                }
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
            let appName = this.chosenApplication["Application"]["values"];
            let changedRoleData = this.processedRole[appName]; 
            changedRoleData["ROLENAME"]["values"] = this.rolename; 
            changedRoleData["Rolename"] = this.rolename;
            changedRoleData["Applications"] = appName; 
            let request = {};
            request[appName] = changedRoleData;
            if (this.pagetitle === "Edit Role") {   console.log("prev"+JSON.stringify(this.previousRequest));         
                let previousRoleData = this.previousRequest; 
                previousRoleData["Rolename"] = this.rolename;  
                let previousRequest = {};
                previousRequest[appName] = previousRoleData;
                 console.log("==="+JSON.stringify(previousRequest));
                let roleUpdate = new RoleUpdate(previousRequest, request);
                this.model.updateRole(roleUpdate).toPromise().then().catch((response) => this.checkError(response));
            } else {
                this.model.insertRole(request).toPromise().then().catch((response) => this.checkError(response));
            }
            this.closeModalDialog();
           // window.location.reload();
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
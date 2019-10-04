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
    updateMode = false;
    display='none'; //default Variable
    title = 'app';
    pagetitle = '';
    rolename = '';
    componentRef: ComponentRef<any>;
    dataRecievedFromRolesTableScreen: object;
    role: object;
    request: object;
    chosenApplication: object;
    appSelectedDropdownItems = [];
    applicationDropdownList: Array<string> = [];
    dropdownSettings = {};
    dropdownMultiSettings = {};
    errorMessage = "error message";

    @ViewChild('dropboxcontainer', { read: ViewContainerRef }) container;
    constructor(private resolver: ComponentFactoryResolver, private model: Model) {  
        let promise = this.getRoleDataPromise();  
        this.getRoleData(promise);       
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
        let promiseRoleData = this.getRoleDataPromise();
        this.getRoleData(promiseRoleData);   //if update we have to get all roles every time when window is open, becouse all chosen items impacts role model
        if (role) {            
            this.dataRecievedFromRolesTableScreen = role;
            this.pagetitle = "Edit Role";
            this.updateMode = true;
            this.rolename = role["Rolename"];      
            promiseRoleData.then(() => {                
                this.selectApplication(role["Applications"]); 
            });

            this.appSelectedDropdownItems = [];
            this.appSelectedDropdownItems.push(role["Applications"]);            
        } else {
            this.dataRecievedFromRolesTableScreen = undefined;
            this.updateMode = false;
            this.appSelectedDropdownItems = [];
            this.rolename = "";
            this.clearComponents();
            this.pagetitle = "Create Role";
        } 
        this.request = {};
        this.display='block';
    }

    closeModalDialog(){
        this.display='none';
    }
    
    clearComponents() {
        this.container.clear(); 
    }
    
    createComponent(title, entryValues) {
        if (entryValues[0] !== "text" && entryValues[0] !== "options")  {
            const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(DynamicDropboxComponent);
            this.componentRef = this.container.createComponent(factory);           
            this.componentRef.instance.title = title;
            this.componentRef.instance.dropdownList = entryValues[0];
            this.componentRef.instance.selectedItems = [];
            
            this.componentRef.instance.chosenSelectedItems.subscribe(data => {
                let appName:string = this.chosenApplication["Application"].values[0];
                this.role[appName][title].values = data;
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
            if (this.dataRecievedFromRolesTableScreen) {
                let opts = this.dataRecievedFromRolesTableScreen["Options"];
                for (let el of opts) {                 
                    if (el.startsWith(title)) {
                        let selectedRolesArray = el.substring(el.indexOf(":") + 2).split(",");
                        selectedRolesArray.forEach((r) => {
                            this.componentRef.instance.selectedItems.push(r);
                            let appName:string = this.chosenApplication["Application"].values[0];
                            this.role[appName][title].values = r;
                        });

                        break;
                    }
                }
            }
        }
    }
    
    destroyComponent() {
        this.componentRef.destroy();
    }
    
    getRoleData(promise: Promise<object>) {
            promise.then(data => {
                let applications: Array<string> = [];
                if ((data != undefined)) {
                    this.role = data;
                    Object.entries(this.role).forEach(entry => applications.push(Object.values(entry)[0]));
                    this.applicationDropdownList = applications;
                }
            });
    }
    
    getRoleDataPromise(): Promise<object> {
        return this.model.getRole().toPromise();
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
            let appName = this.chosenApplication["Application"]["values"][0];
            let multiselectIndicator = this.bindMultiselectToRoleName(this.role[appName]);
            this.request["ROLENAME"] = this.rolename;
            this.request["Application"] = appName;
            delete this.request["Options"];             
            this.addPropsToJsonObjectFromAdditionalProps(this.role[appName], this.request, multiselectIndicator);
            
            if (this.pagetitle === "Edit Role") {     
                this.addPropsToJsonObjectFromOptions(this.dataRecievedFromRolesTableScreen, multiselectIndicator);
                let oldRoleName = this.dataRecievedFromRolesTableScreen["Rolename"];
                this.dataRecievedFromRolesTableScreen["ROLENAME"] = oldRoleName;
                this.dataRecievedFromRolesTableScreen["Application"] = appName;
                
                delete this.dataRecievedFromRolesTableScreen["Options"];
                delete this.dataRecievedFromRolesTableScreen["Actions"];
                delete this.dataRecievedFromRolesTableScreen["Applications"];
                delete this.dataRecievedFromRolesTableScreen["Rolename"];
                
                let roleUpdate = new RoleUpdate(this.dataRecievedFromRolesTableScreen, this.request);
                this.model.updateRole(roleUpdate).toPromise().then().catch((response) => this.checkError(response));
                this.dataRecievedFromRolesTableScreen["Rolename"] = oldRoleName;
            } else {
                this.model.insertRole(this.request).toPromise().then().catch((response) => this.checkError(response));
            }
            this.closeModalDialog();
            window.location.reload();
        }
    }
    
    //returns object of all roles of the applications role if it contains single select ability or multi select ability
    private bindMultiselectToRoleName(role: object): object {
        var multiselectIndicator = {};
        Object.entries(role).forEach((entry)=>{
            if ((entry[0] !== "Options") && (entry[0] !== "ROLENAME") && (entry[0] !== "Application") && (entry[0] !== "Actions") &&
                 (entry[0] !== "Applications" ) && (entry[0] !== "Rolename" )) {
                    multiselectIndicator[entry[0]] = entry[1].multiselect;
            }
        });
        return multiselectIndicator;
    }
    
    private addPropsToJsonObjectFromAdditionalProps(role: object, roleObj: object, multiselectIndicator: object) {
        Object.entries(role).forEach((entry)=>{
            if ((entry[0] !== "Options") && (entry[0] !== "ROLENAME") && (entry[0] !== "Application") && (entry[0] !== "Actions") &&
                 (entry[0] !== "Applications" ) && (entry[0] !== "Rolename" )) {
                    let isMultiselect = multiselectIndicator[entry[0]];
                    if (isMultiselect === true) {
                        let entryString = entry[1]["values"].toString();
                        let splittedValues =  entryString.substring(entryString.indexOf(":") + 1).split(",");
                        let valuesArray = [];
                        splittedValues.forEach((val) => valuesArray.push(val));
                        roleObj[entry[0]] = valuesArray;
                    } else {
                        if (Array.isArray(entry[1]["values"])) {
                            roleObj[entry[0]] = entry[1]["values"][0];
                        } else {
                            roleObj[entry[0]] = entry[1]["values"];
                        }
                    }
            }
        });
    }
    
    //function fills properties to json object from Options single property
    private addPropsToJsonObjectFromOptions(roleObj: object, multiselectIndicator: object) {
        if (roleObj["Options"]) {
            Object.entries(roleObj["Options"]).forEach((entry)=>{
                let entryString = entry[1].toString();
                let isMultiselect = multiselectIndicator[entryString.substring(0, entryString.indexOf(":"))]; 
                if (isMultiselect === true) {
                    let splittedValues =  entryString.substring(entryString.indexOf(":") + 2).split(",");
                    let valuesArray = [];
                    splittedValues.forEach((val) => valuesArray.push(val));
                    roleObj[entryString.substring(0, entryString.indexOf(":"))] = valuesArray;
                } else {
                    roleObj[entryString.substring(0, entryString.indexOf(":"))] = entry[1].toString().substring(entryString.indexOf(":") + 2);
                }
            });
        }
    }
    
    checkError(errorCode: number) {
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
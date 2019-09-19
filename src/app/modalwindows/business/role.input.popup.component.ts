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
            this.getRoleData();   //if update we have to get all roles every time when window is open, becouse all chosen items impacts role model
            this.dataRecievedFromRolesTableScreen = role;
            this.pagetitle = "Edit Role";
            this.updateMode = true;
            this.rolename = role["Rolename"];
            this.selectApplication(role["Applications"]);
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
        if (entryValues[0] !== "text")  {      
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
    
    getRoleData() {
        this.model.getRole().subscribe(data => {
            let applications: Array<string> = [];
            if ((data != undefined)) {
                this.role = data;
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
            let appName = this.chosenApplication["Application"]["values"][0];console.log("+++"+JSON.stringify(this.role[appName]));
            this.request["ROLENAME"] = this.rolename;
            this.request["Application"] = appName;
            this.request["Actions"] = "";
            delete this.request["Options"]; 
            this.addPropsToJsonObjectFromAdditionalProps(this.role[appName], this.request);
    console.log("%%%"+JSON.stringify(this.dataRecievedFromRolesTableScreen));
            if (this.pagetitle === "Edit Role") {     
                this.addPropsToJsonObjectFromOptions(this.dataRecievedFromRolesTableScreen);
                this.dataRecievedFromRolesTableScreen["ROLENAME"] = this.dataRecievedFromRolesTableScreen["Rolename"];
                delete this.dataRecievedFromRolesTableScreen["Options"];
                let roleUpdate = new RoleUpdate(this.dataRecievedFromRolesTableScreen, this.request);
       console.log("---"+JSON.stringify(roleUpdate));
                this.model.updateRole(roleUpdate).toPromise().then().catch((response) => this.checkError(response));
            } else {
                this.model.insertRole(this.request).toPromise().then().catch((response) => this.checkError(response));
            }
            this.closeModalDialog();
            //window.location.reload();
        }
    }
    
    private addPropsToJsonObjectFromAdditionalProps(role: object, roleObj: object) {
        Object.entries(role).forEach((entry)=>{
            if ((entry[0] !== "Options") && (entry[0] !== "ROLENAME") && (entry[0] !== "Application") && (entry[0] !== "Actions") &&
                 (entry[0] !== "Applications" ) && (entry[0] !== "Rolename" )) {
                    
                    roleObj[entry[0]] = entry[1]["values"];
            }
        });
    }
    
     private addPropsToJsonObjectFromOptions(roleObj: object) {
        if (roleObj["Options"]) {
            Object.entries(roleObj["Options"]).forEach((entry)=>{            
                    let entryString = entry[1].toString();
                    let splittedValues =  entryString.substring(entryString.indexOf(":")+2).split(",");
                    let valuesArray = [];
                    splittedValues.forEach((val) => valuesArray.push(val));
                    roleObj[entryString.substring(0, entryString.indexOf(":"))] = valuesArray;

            });
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
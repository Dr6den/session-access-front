import {Component, Input, ComponentFactory, ComponentRef, ComponentFactoryResolver, ViewContainerRef, ViewChild, Output, EventEmitter, OnInit} from '@angular/core'
import { BrowserModule } from '@angular/platform-browser';
import { NgForm } from "@angular/forms";
import { FormBuilder, FormGroup, FormControl, Validators }  from '@angular/forms';
import { DynamicDropboxComponent } from './dynamic/dynamic.dropbox.component';
import { DynamicInputComponent } from './dynamic/dynamic.input.component';
import { Model } from "../../model/repository.model";
import { Role } from "../../model/role.model";
import { SchemeMetadata } from "../../model/scheme.metadata";
import { RoleUpdate } from "../../model/roleUpdate.model";

@Component({
  selector: 'role-input-popup',
  templateUrl: './role.input.popup.component.html',
  styleUrls: ['./role.input.popup.component.css']
})
export class RoleInputPopupComponent implements OnInit {
    display='none'; //default Variable
    pagetitle = '';
    rolename = '';
    componentRef: ComponentRef<any>;
    inputComponentRef: ComponentRef<any>;
    dataRecievedFromRolesTableScreen: object;
    schemeMetadata: SchemeMetadata;
    schemeName: string;
    scheme: object;
    schemeInfo: object; //includes metadata of the scheme
    request: object;
    chosenApplication: object;
    appSelectedDropdownItems = [];
    applicationDropdownList: Array<string> = [];
    dropdownSettings = {};
    dropdownMultiSettings = {};
    errorMessage = "error message";

    @ViewChild('dropboxcontainer', { read: ViewContainerRef }) container;
    constructor(private resolver: ComponentFactoryResolver, private model: Model) {  
      //  let promise = this.getSchemaInfoPromise();  
      //  this.setDropdownListByApplications(promise, null);       
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
    
    openModalDialog(directory?: object, schemeName?: string, schemeMetadata?: SchemeMetadata) {
        this.schemeName = schemeName;
        this.schemeMetadata = schemeMetadata;
        if (schemeMetadata.containsNestedProperties) {
            this.setDropdownListByApplications(this.schemeMetadata['scheme']);   //if update we have to get all roles every time when window is open, becouse all chosen items impacts role model

            if (directory) {    
                this.dataRecievedFromRolesTableScreen = directory;
                this.pagetitle = "Edit " + schemeName;
                this.rolename = directory["ROLENAME"];                      
                this.selectApplication(directory["Application"]); 

                this.appSelectedDropdownItems = [];
                this.appSelectedDropdownItems.push(directory["Application"]);            
            } else {
                this.dataRecievedFromRolesTableScreen = undefined;
                this.appSelectedDropdownItems = [];
                this.rolename = "";
                this.clearComponents();
                this.pagetitle = "Create " + schemeName;
            } 
        } else {
            if (directory) {
                this.pagetitle = "Edit " + schemeName;
                this.dataRecievedFromRolesTableScreen = directory;
            } else {
                this.pagetitle = "Create " + schemeName;
                this.dataRecievedFromRolesTableScreen = undefined;
                this.clearComponents();
            }
            this.autogenerateComponentsInSimplePopup(directory);
        }
        this.request = {};
        this.display='block';
        this.errorMessage = "error message";
    }

    closeModalDialog(){
        this.display='none';
    }
    
    clearComponents() {
        this.container.clear(); 
    }
    
    createDynamicInput(title, value) {
        const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(DynamicInputComponent);
        this.inputComponentRef = this.container.createComponent(factory);
        this.inputComponentRef.instance.title = title;
        this.inputComponentRef.instance.value = value;
    }
    
    createComponent(title, entryValues, multiselect, show) {
        if (title !== "ROLENAME" && title !== "Options")  {
            const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(DynamicDropboxComponent);
            this.componentRef = this.container.createComponent(factory);           
            this.componentRef.instance.title = title;
            this.componentRef.instance.dropdownList = entryValues;
            this.componentRef.instance.selectedItems = [];
           
            this.componentRef.instance.chosenSelectedItems.subscribe(data => {
                let appName:string = this.chosenApplication["Application"].values[0];
                this.schemeMetadata.scheme[appName][title].values = data;
            }); 
            if (multiselect) {
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
                if (show === true || show === false) {
                    this.componentRef.instance.selectedItems.push(this.dataRecievedFromRolesTableScreen[title]);
                } else {                
                    let opts = this.dataRecievedFromRolesTableScreen[show].split(";");
                    for (let el of opts) {               
                        if (el.startsWith(title)) {
                            let selectedRolesArray = el.substring(el.indexOf(":") + 1).split(",");
                            selectedRolesArray.forEach((r) => {
                                this.componentRef.instance.selectedItems.push(r);
                                let appName:string = this.chosenApplication["Application"].values[0];
                                this.schemeInfo[appName][title].values = r;
                            });

                            break;
                        }
                    }
                }
            }
        }
    }
    
    destroyComponent() {
        this.componentRef.destroy();
    }
    
    setDropdownListByApplications(schemeData: object) {
        let applications: Array<string> = [];
        if ((schemeData != undefined)) {
            this.schemeInfo = schemeData;//deprecate
            Object.entries(schemeData).forEach(entry => applications.push(Object.values(entry)[0]));
            this.applicationDropdownList = applications;
        }
    }
    //deprecated, should be deleted in next release
    setDropdownListByApplicationsWithPromise(promise: Promise<object>, schemeName: string) {
            promise.then(data => {
                let applications: Array<string> = [];
                if ((data != undefined)) {
                    this.schemeInfo = data[schemeName];
                    Object.entries(this.schemeInfo).forEach(entry => applications.push(Object.values(entry)[0]));
                    this.applicationDropdownList = applications;
                }
            });
    }
    
    getSchemaInfoPromise(): Promise<object> {
        //return this.model.getRole().toPromise();
        return this.model.getSchemesInfo().toPromise();
    }
    
    onApplicationSelect(item: any) {          
        this.selectApplication(item);
    }
    
    selectApplication(item: any) {
        this.chosenApplication = this.schemeMetadata.scheme[item];
        this.clearComponents();
        Object.entries(this.chosenApplication).forEach(entry => {
            if (entry[0] !== "Application") {
                let entryValues = Object.values(this.chosenApplication[entry[0]].values);
                let multiselect;
                if (this.chosenApplication[entry[0]].multiselect) {
                    multiselect = Object.values(this.chosenApplication[entry[0]].multiselect);
                }
                this.createComponent(entry[0], entryValues, multiselect, this.chosenApplication[entry[0]].show);
            }
        });
    }
    
    autogenerateComponentsInSimplePopup(item: any) {
        let schemeMeta = this.schemeMetadata.scheme;
        this.clearComponents();
        Object.entries(schemeMeta).forEach(entry => {
            if(schemeMeta[entry[0]].values === 'text') {
                let val = schemeMeta[entry[0]].values;
                if (item) {
                    this.createDynamicInput(entry[0], this.dataRecievedFromRolesTableScreen[entry[0]]);
                } else {
                    this.createDynamicInput(entry[0], "");
                }
            } else {
                let entryValues = Object.values(schemeMeta[entry[0]].values);
                let multiselect;
                if (schemeMeta[entry[0]].multiselect) {
                    multiselect = Object.values(schemeMeta[entry[0]].multiselect);
                }
                this.createComponent(entry[0], entryValues, multiselect, schemeMeta[entry[0]].show);
            }
        });
    }
    
    submitForm(form: NgForm) {
        if (form.valid) {
            let appName = this.chosenApplication["Application"]["values"][0];
            let multiselectIndicator = this.bindMultiselectToRoleName(this.schemeInfo[appName]);
            this.request["ROLENAME"] = this.rolename;
            this.request["Application"] = appName;
            delete this.request["Options"];             
            this.addPropsToJsonObjectFromAdditionalProps(this.schemeInfo[appName], this.request, multiselectIndicator);
            
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
            if (this.errorMessage === "error message") {
                this.closeModalDialog();
                window.location.reload();
            }
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
        this.errorMessage = errorCode.toString();
    }
}
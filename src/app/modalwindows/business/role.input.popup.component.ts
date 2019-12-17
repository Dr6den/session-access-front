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
    updateMode=false;
    display='none'; //default Variable
    pagetitle = '';
    rolename = '';
    componentRef: ComponentRef<any>;
    inputComponentRef: ComponentRef<any>;
    dataRecievedFromRolesTableScreen: object;
    schemeMetadata: SchemeMetadata;
    schemeName: string;
    scheme: object;
    request: object;
    chosenApplication: object;
    appSelectedDropdownItems = [];
    applicationDropdownList: Array<string> = [];
    dropdownSettings = {};
    dropdownMultiSettings = {};
    errorMessage = "error message";

    @ViewChild('dropboxcontainer', { read: ViewContainerRef, static: false }) container;
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
        this.schemeMetadata = JSON.parse(JSON.stringify(schemeMetadata));//deep copy of the object, avoids change
        if (schemeMetadata.containsNestedProperties) {
            this.setDropdownListByApplications(this.schemeMetadata['scheme']);   //if update we have to get all roles every time when window is open, becouse all chosen items impacts role model

            if (directory) {    
                this.dataRecievedFromRolesTableScreen = directory;
                this.pagetitle = "Edit " + schemeName;
                this.updateMode = true;
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
                this.updateMode = false;
            } 
        } else {
            if (directory) {
                this.pagetitle = "Edit " + schemeName;
                this.updateMode = true;
                this.dataRecievedFromRolesTableScreen = directory;
            } else {
                this.pagetitle = "Create " + schemeName;
                this.updateMode = false;
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
        this.inputComponentRef.instance.changedValue.subscribe(data => { 
            this.schemeMetadata.scheme[title].values = data;
        });
    }
    
    createComponent(title, entryValues, multiselect, show) {
        if (title !== "ROLENAME" && title !== "Options")  {
            const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(DynamicDropboxComponent);
            this.componentRef = this.container.createComponent(factory);           
            this.componentRef.instance.title = title;
            this.componentRef.instance.dropdownList = entryValues;
            this.componentRef.instance.selectedItems = [];
           
            this.componentRef.instance.chosenSelectedItems.subscribe(data => {
                if (this.schemeMetadata.containsNestedProperties) {
                    let appName:string = this.chosenApplication["Application"].values[0];
                    this.schemeMetadata.scheme[appName][title].values = data;
                } else {
                    this.schemeMetadata.scheme[title].values = data;
                }
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
                    if (this.schemeMetadata.containsNestedProperties) {
                        let appName:string = this.chosenApplication["Application"].values[0];
                        this.schemeMetadata.scheme[appName][title].values = this.dataRecievedFromRolesTableScreen[appName][title];
                    } else {
                        this.schemeMetadata.scheme[title].values = this.dataRecievedFromRolesTableScreen[title];
                    }
                } else {                
                    let opts = this.dataRecievedFromRolesTableScreen[show].split(";");
                    for (let el of opts) {               
                        if (el.startsWith(title)) {
                            let selectedRolesArray = el.substring(el.indexOf(":") + 1).split(",");
                            selectedRolesArray.forEach((r) => {
                                this.componentRef.instance.selectedItems.push(r);
                                let appName:string = this.chosenApplication["Application"].values[0];
                                this.schemeMetadata.scheme[appName][title].values = r;
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
        if (schemeData != undefined) {
            Object.entries(schemeData).forEach(entry => applications.push(Object.values(entry)[0]));
            this.applicationDropdownList = applications;
        }
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
                    this.schemeMetadata.scheme[entry[0]].values = this.dataRecievedFromRolesTableScreen[entry[0]];
                } else {
                    this.createDynamicInput(entry[0], "");
                    this.schemeMetadata.scheme[entry[0]].values = "";
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
            if (this.schemeMetadata.containsNestedProperties) {
                let appName = this.chosenApplication["Application"]["values"][0];
                let multiselectIndicator = this.bindMultiselectToRoleName(this.schemeMetadata.scheme[appName]);
                this.request["ROLENAME"] = this.rolename;
                this.request["Application"] = appName;
                delete this.request["Options"];             
                this.addPropsToJsonObjectFromAdditionalProps(this.schemeMetadata.scheme[appName], this.request, multiselectIndicator);
         
                if (this.pagetitle.startsWith("Edit")) { 
                    this.addPropsToJsonObjectFromOptions(this.dataRecievedFromRolesTableScreen, multiselectIndicator);
                     
                    let oldRoleName = this.dataRecievedFromRolesTableScreen["ROLENAME"];
                    this.dataRecievedFromRolesTableScreen["Application"] = appName;
                
                    delete this.dataRecievedFromRolesTableScreen["Options"];
                    delete this.dataRecievedFromRolesTableScreen["Actions"];
                    delete this.dataRecievedFromRolesTableScreen["Applications"];
                    delete this.dataRecievedFromRolesTableScreen["Rolename"];
                    delete this.dataRecievedFromRolesTableScreen["schemeName"];
                    
                    let roleUpdate = new RoleUpdate(this.dataRecievedFromRolesTableScreen, this.request);
                    if (roleUpdate.oldValues["__TemporaryId"]) {//another endpoint esspecially for the temporary tables
                        this.model.updateElemFromTemporaryScheme(roleUpdate).toPromise().then().catch((response) => this.checkError(response));
                    } else {
                        this.model.updateScheme(roleUpdate, this.schemeName).toPromise().then().catch((response) => this.checkError(response));
                    }
                } else {
                    this.model.insertScheme(this.request, this.schemeName).toPromise().then().catch((response) => this.checkError(response));
                }                
            } else {
                this.request = this.generateInsertRequestForUnnesetdDictionary(this.schemeMetadata.scheme);
                if (this.pagetitle.startsWith("Edit")) { 
                    delete this.dataRecievedFromRolesTableScreen["Actions"];
                    delete this.dataRecievedFromRolesTableScreen["schemeName"];
                    let roleUpdate = new RoleUpdate(this.dataRecievedFromRolesTableScreen, this.request);
                    if (roleUpdate.oldValues["__TemporaryId"]) {//another endpoint esspecially for the temporary tables
                        this.model.updateElemFromTemporaryScheme(roleUpdate).toPromise().then().catch((response) => this.checkError(response));
                    } else {
                        this.model.updateScheme(roleUpdate, this.schemeName).toPromise().then().catch((response) => this.checkError(response));
                    }
                } else {
                    this.model.insertScheme(this.request, this.schemeName).toPromise().then().catch((response) => this.checkError(response));
                }                
            }
            if (this.errorMessage === "error message") {
                this.closeModalDialog();
           //     window.location.reload();
            }
        }
    }
    
    private generateInsertRequestForUnnesetdDictionary(scheme: object): object {
        let request: object = {};
        for(let entry in scheme) {
            if (scheme[entry]['multiselect']) {
                request[entry] = scheme[entry]['values'];
            } else {
                request[entry] = (Array.isArray(scheme[entry]['values'])) ? scheme[entry]['values'][0] : scheme[entry]['values'];
            }
        }
        return request;
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
        let app = this.chosenApplication["Application"]["values"][0];
        let replaceVals = [];
        let appSchemeData = this.schemeMetadata.scheme[app];
        for(let entry in appSchemeData) {
            if (this.schemeMetadata.scheme[app][entry]['show'] !== false && this.schemeMetadata.scheme[app][entry]['show'] !== true) {
                if (!replaceVals.includes(this.schemeMetadata.scheme[app][entry]['show']))
                    replaceVals.push(this.schemeMetadata.scheme[app][entry]['show']);
            }
        }
        for (let val in replaceVals) {
            if(roleObj[replaceVals[val]]) {
                let optsArray = roleObj[replaceVals[val]].split(';');
                optsArray.forEach((opt) => {
                    if (multiselectIndicator[opt.substring(0, opt.indexOf(":"))]) {
                        roleObj[opt.substring(0, opt.indexOf(":"))] = [];
                        let splittedOpts = opt.substring(opt.indexOf(":") + 1).split(',');
                        splittedOpts.forEach((o) => roleObj[opt.substring(0, opt.indexOf(":"))].push(o));
                    } else {
                        roleObj[opt.substring(0, opt.indexOf(":"))] = opt.substring(opt.indexOf(":") + 1);
                    }
                });
            }
        }
    }
    
    checkError(errorCode: number) {
        this.errorMessage = errorCode.toString();
    }
}
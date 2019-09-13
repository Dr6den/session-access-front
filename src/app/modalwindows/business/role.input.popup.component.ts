import {Component, Input, ComponentFactory, ComponentRef, ComponentFactoryResolver, ViewContainerRef, ViewChild, Output, EventEmitter, OnInit} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser';
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
    componentRef: ComponentRef<any>;
    role: object;
    appSelectedDropdownItems = [];
    applicationDropdownList: Array<string> = [];
    dropdownSettings = {};
    dropdownMultiSettings = {};

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
    
    openModalDialog(){console.log(this.container);
        this.display='block'; //Set block css
        //this.getRoleData();
        //this.createComponent("Jesus");
        //this.createComponent("Ressurect");
    }

    closeModalDialog(){
        this.display='none'; //set none css after close dialog
    }
    
    clearComponents() {
        this.container.clear(); 
    }
    
    createComponent(title) {        
        const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(DynamicDropboxComponent);
        this.componentRef = this.container.createComponent(factory);           
        this.componentRef.instance.title = title;
    }
    
    destroyComponent() {
        this.componentRef.destroy();
    }
    
    getRoleData() {
        this.model.getRole().subscribe(data => {
            let applications: Array<string> = [];
            if ((data != undefined)) {
                this.role = data;//console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"+JSON.stringify(this.role));
                            //Object.values(this.role).forEach(e => console.log(Object.values(e)[0]));
                            //Object.keys(this.role).forEach(e => console.log(Object.keys(e)[0]));
                            
                Object.entries(this.role).forEach(entry => applications.push(Object.values(entry)[0]));
                            
                console.log(Object.entries(this.role['EMEA EUA & SPO']['ACCESS']));
                this.applicationDropdownList = applications;
                           
//Object.values(this.role).forEach(e => Object.values(e).forEach(el => console.log(el)));

                            //this.setUpDropdowns();
			}
                    });
    }
    
    onApplicationSelect(item: any) {        
        //this.container.clear(); 
        //this.componentRef.destroy(); 
    console.log("hey");    
        let selectedRole = this.role[item];
        this.clearComponents();
        Object.entries(selectedRole).forEach(entry => {
            if (entry[0] !== "Application") {console.log(entry[0]);
                this.createComponent(entry[0]);
            }
        });
    }
}
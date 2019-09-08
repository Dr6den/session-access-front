import { Component, Input } from '@angular/core';
@Component({
    selector: 'dropbox-dynamic',
    templateUrl: './dynamic.dropbox.component.html',
    styleUrls: ['./dynamic.dropbox.component.css']
})
export class DynamicDropboxComponent {
    @Input() title: string;
    dropdownSettings = {};
    
    constructor() {
        this.dropdownSettings = {
            singleSelection: true,
            idField: 'item_id',
            textField: 'item_text',
            enableCheckAll: false,
            itemsShowLimit: 9,
            allowSearchFilter: false
        };
    }
}
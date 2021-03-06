import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
    selector: 'dropbox-dynamic',
    templateUrl: './dynamic.dropbox.component.html',
    styleUrls: ['./dynamic.dropbox.component.css']
})
export class DynamicDropboxComponent {
    @Input() title: string;
    @Input() dropdownList: Array<string>;
    @Input() dropdownSettings;
    @Input() selectedItems;
    @Output() chosenSelectedItems = new EventEmitter();
    
    onItemSelect(item: any) {
        if (item === "ALL" || this.selectedItems.some((item) => {return item === "ALL";})) {
            this.selectedItems =  JSON.parse('["ALL"]');
        }
        if (item === "All" || this.selectedItems.some((item) => {return item === "All";})) {
            this.selectedItems =  JSON.parse('["All"]');
        }
        this.chosenSelectedItems.emit(this.selectedItems);
    }
    
    onItemDeselect(item: any) {
        this.chosenSelectedItems.emit(this.selectedItems);
    }
}
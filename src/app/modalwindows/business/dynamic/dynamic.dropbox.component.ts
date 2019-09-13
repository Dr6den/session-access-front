import { Component, Input } from '@angular/core';
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
    
    onItemSelect(item: any) {
        if (item === "All" || this.selectedItems.some((item) => {return item === "All";})) {
            this.selectedItems =  JSON.parse('["All"]');
        }
    }
}
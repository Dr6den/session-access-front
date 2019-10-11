import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
    selector: 'table-filter-popup',
    templateUrl: './table.filter.popup.html',
    styleUrls: ['./table.filter.popup.css']
})
export class TableFilterPopup {
    display='none'; //default Variable
    @Input() column: string;
    visibleSelectedDescendingIcon: boolean = false;
    visibleSelectedAscendingIcon: boolean = false;
    visibleDescendingIcon: boolean = true;
    visibleAscendingIcon: boolean = true;
    
    openModalDialog(visiblityOfSortArrows:string) {
        this.manageOfArrowsVisiblity(visiblityOfSortArrows);
        console.log(this.column)
        this.display='block'; //Set block css
    }
    
    manageOfArrowsVisiblity(visiblityOfSortArrows:string) {
        if (visiblityOfSortArrows.startsWith(this.column)) {
            if (visiblityOfSortArrows.includes("true")) {
                this.visibleSelectedAscendingIcon = true;
                this.visibleSelectedDescendingIcon = false;
                this.visibleAscendingIcon = false;
                this.visibleDescendingIcon = true;
            } else {
                this.visibleSelectedAscendingIcon = false;
                this.visibleSelectedDescendingIcon = true;
                this.visibleAscendingIcon = true;
                this.visibleDescendingIcon = false;
            }
        } else {
            this.visibleSelectedAscendingIcon = false;
            this.visibleSelectedDescendingIcon = false;
            this.visibleAscendingIcon = true;
            this.visibleDescendingIcon = true;
        }
    }

    closeModalDialog(){
        this.display='none'; //set none css after close dialog
    }
}

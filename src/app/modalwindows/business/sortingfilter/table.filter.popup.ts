import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
    selector: 'table-filter-popup',
    templateUrl: './table.filter.popup.html',
    styleUrls: ['./table.filter.popup.css']
})
export class TableFilterPopup {
    display='none'; //default Variable
    @Input() column: string;
    @Output() callSortingOfTheTable = new EventEmitter();
    @Output() filterByName = new EventEmitter();
    @Output() closeEvent = new EventEmitter();
    @Input() data: object[];
    checkboxesText: string[] = [];
    checkedCheckboxes: boolean[] = [];
    selectAllChecked: boolean = true;
    deselectAllChecked: boolean = false;
    //I use this reserved to store filters for search filtering field, they will save data while we are working with search input field
    reservedCheckboxesText: string[] = [];
    reservedCheckedCheckboxes: boolean[] = [];
    
    visibleSelectedDescendingIcon: boolean = false;
    visibleSelectedAscendingIcon: boolean = false;
    visibleDescendingIcon: boolean = true;
    visibleAscendingIcon: boolean = true;
    
    openModalDialog(visiblityOfSortArrows:string) {
        this.data.forEach((obj) => {if (!this.checkboxesText.includes(obj[this.column])) {
            this.checkboxesText.push(obj[this.column]);
            this.reservedCheckboxesText.push(obj[this.column]);
            this.checkedCheckboxes.push(true);
            this.reservedCheckedCheckboxes.push(true);
        }});
        this.checkboxesText.sort();
        this.manageOfArrowsVisiblity(visiblityOfSortArrows);
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

    closeModalDialog(event){
        if (event) {
            event.stopPropagation();
        }
        this.display='none'; //set none css after close dialog
        this.closeEvent.emit(this.column); //emits for change icon on the table on close
    }
    
    sortAscending(event) {
        event.stopPropagation();
        if (!this.visibleSelectedAscendingIcon) {
            this.callSortingOfTheTable.emit({column: this.column, order: "asc"});
        }
        this.closeModalDialog(event);
    }
    
    sortDescending(event) {
        event.stopPropagation();
        if (!this.visibleSelectedDescendingIcon) {
            this.callSortingOfTheTable.emit({column: this.column, order: "desc"});
        }
        this.closeModalDialog(event);
    }
    
    selectAll(event) {
        if (!this.selectAllChecked) {
            this.selectAllChecked = true;
            this.deselectAllChecked = false;
            this.checkedCheckboxes = this.checkedCheckboxes.map((val) => val=true);
        } else {
            this.selectAllChecked = false;
        }
        event.stopPropagation();
    }
    
    deselectAll(event) {
        if (!this.deselectAllChecked) {
            this.selectAllChecked = false;
            this.deselectAllChecked = true;
            this.checkedCheckboxes = this.checkedCheckboxes.map((val) => val=false);
        } else {
            this.deselectAllChecked = false;
        }
        event.stopPropagation();
    }
    
    selectCheckbox(event, i) {
        event.stopPropagation();
        if (!this.checkedCheckboxes[i]) {
            this.checkedCheckboxes[i] = true;  
            this.deselectAllChecked = false;          
        } else {
            this.checkedCheckboxes[i] = false;
            this.selectAllChecked = false;
        }        
    }
    
    filterTable(event) {
        this.closeModalDialog(event);
        let filteredNames:string[] = [];
        if (this.column === "Role") {
            for (var i = 0; i < this.checkboxesText.length; i++) {
                if (this.checkedCheckboxes[i]) {
                    filteredNames.push(this.checkboxesText[i].substring(0, this.checkboxesText[i].indexOf(":") - 1));
                }
            }
        } else {
            for (var i = 0; i < this.checkboxesText.length; i++) {
                if (this.checkedCheckboxes[i]) {
                    filteredNames.push(this.checkboxesText[i]);
                }
            }
            
        }
        this.filterByName.emit({column: this.column, names: filteredNames});        
    }
    
    filter(event: string) {
        this.checkedCheckboxes = [...this.reservedCheckedCheckboxes];
        this.checkboxesText = [...this.reservedCheckboxesText];
        if(event !== "") {
            for (var i = this.checkboxesText.length - 1; i >= 0; i--) {
                if (!this.checkboxesText[i].includes(event)) {                    
                    this.checkboxesText.splice(i, 1);
                    this.checkedCheckboxes.splice(i, 1);
                }
            }
        }
    }
    
    stopPropogation(event) {
        event.stopPropagation();
    }
    
    onClickedOutside(event: Event) {
        this.closeModalDialog(event);
    }
}

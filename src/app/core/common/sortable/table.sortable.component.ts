import { Component, Input, Output, EventEmitter, ViewChildren, QueryList, HostListener } from "@angular/core";
import { TableOrderByPipe } from "./table.sort.orderby.pipe";
import { FormatTablePipe } from "./table.format.pipe";
import { InfoPopupComponent } from "./info.popup.component";
import { Role } from "../../../model/role.model";
import { User } from "../../../model/user.model";
import { Model } from "../../../model/repository.model";
import { SchemeMetadata } from "../../../model/scheme.metadata";
import { UserInputPopupComponent } from "../../../modalwindows/business/user.input.popup.component";
import { TableFilterPopup } from "../../../modalwindows/business/sortingfilter/table.filter.popup";

@Component({
  selector: 'table-sortable',
  templateUrl: 'table.sortable.component.html',
  styleUrls: ["table.sortable.component.css"]
})
export class TableSortable {
  public popoverTitle: string = 'Delete the role';
  public popoverMessage: string = 'Are you sure you want delete the role?';
  public cancelClicked: boolean = false;
  
  @Input() columns: any[];
  @Input() data: any[];
  @Input() sort: any;
  @Input() schemeMetadata: SchemeMetadata;
  @Input() schemeName: string;
  @Input() numberOfColumns: number;
  @Output() callUserInputPopup = new EventEmitter();
  @Output() callRoleInputPopup = new EventEmitter();
  @Output() filterByNames = new EventEmitter();
  
  windowWidth: number = window.innerWidth;  
  tdwidth: string;
  thwidth: string;
  sortArrowsVisible:string = "";
  openedFilter:boolean = false;
  openedFilters:object = {};
  @ViewChildren(TableFilterPopup) tableFilterPopups: QueryList<TableFilterPopup>;
  @ViewChildren(InfoPopupComponent) infoPopups: QueryList<InfoPopupComponent>;
  
  JSON;
  constructor(private model: Model){this.JSON = JSON;}
  
  ngOnInit() {
      this.popoverTitle = 'Delete the ' + this.schemeName;
      this.popoverMessage = 'Are you sure you want delete the ' + this.schemeName + '?';
  }
  
  ngOnChanges() {
      if (this.numberOfColumns) {
          this.accountTableWidthAccordingToColumsNumber(this.windowWidth);
      }
      if (this.columns) {
        this.columns.forEach((columnName) => {
            let columnVar = {};
            columnVar[columnName['variable']] = false;
            this.openedFilters[columnName['variable']] = false;
        });
      }
  }
 
  selectedClass(columnName): string {
      this.sortArrowsVisible = this.sort.column + this.sort.descending;//set up sorting arrows in the header of the table, they indicates acending or descenidng sorting
      return columnName == this.sort.column ? 'sort-' + this.sort.descending : 'sort-' + this.sort.descending;
    //return columnName == this.sort.column ? 'sort-' + this.sort.descending : false;
  }
  
  changeSorting(columnName): void{

    var sort = this.sort;
    if (sort.column == columnName) {
      sort.descending = !sort.descending;
    } else {
      sort.column = columnName;
      sort.descending = false;
    }
  }
  
  changeSortingDescending(columnName): void{

    var sort = this.sort;
    if (sort.column == columnName) {
      sort.descending = !sort.descending;
    } else {
      sort.column = columnName;
      sort.descending = true;
    }
  }
  
  convertSorting(): string{
    return this.sort.descending ? '-' + this.sort.column : this.sort.column;
  }
  
  /**
   * delete item is universal method, so you can use it with User and Role
   */
  deleteItem(item: any) {
      if (this.schemeName === 'Users') {
        this.model.deleteUser(item.NTSID);
      } else if (this.schemeName === 'Roles') {
        this.model.deleteRole(item.ROLENAME);	
      } else {
        delete item["Actions"];
        this.model.deleteScheme(item, this.schemeName);
      }
      window.location.reload();
  }
  
  userInput(user: User) {
      this.callUserInputPopup.emit(user);
  }
  
  /*role that arrives from from html table doesn't have enough fields, thats why I have to find real objects in table and send them*/
  roleInput(role: object) {
      let roleWithAllNeededFields;
      if (this.schemeMetadata.containsNestedProperties) {        
        this.data.forEach((rol) => {
          if (rol["ROLENAME"] === role["ROLENAME"]) {
            roleWithAllNeededFields = rol;
          }
        });
        roleWithAllNeededFields["schemeName"] = this.schemeName;
      } else {
        /*this.data.forEach((rol) => {
          if (rol["Roll Up"] === role["Roll Up"]) {
            roleWithAllNeededFields = rol;
          }
        });*/
        roleWithAllNeededFields = {...role};
        roleWithAllNeededFields["schemeName"] = this.schemeName;
      }
      this.callRoleInputPopup.emit(roleWithAllNeededFields);
  }
  
  openFilter(columnName: string, event) {
      for (let f in this.openedFilters) {
         this.openedFilters[f] = false;
      }
      this.tableFilterPopups.forEach((filt) => filt.closeModalDialog(undefined));

      this.openedFilters[columnName] = true;
      let chosenColumnModalWindow = this.tableFilterPopups.filter((element, index) => element.column === columnName);
      chosenColumnModalWindow[0].openModalDialog(this.sortArrowsVisible);
      event.stopPropagation();
  }
  
  displayInfo(columnName: string, rowIndex: number) {
      let chosenColumnModalWindow = this.infoPopups.filter((element, index) => element.rowIndex === rowIndex && element.column === columnName);
      //we have to define position of the modal window
      let rowElement = document.getElementById(columnName + rowIndex);
      let offsetTop:number = rowElement.offsetTop;
      let offsetLeft:number = rowElement.offsetLeft;
      let top:number = rowElement.getBoundingClientRect().top - offsetTop;
      let left:number = rowElement.getBoundingClientRect().left - offsetLeft * 4;
      chosenColumnModalWindow[0].openModalDialog(top + "px", left + "px"); 
  }

  callSortingOfTable(event) {
      if (event.order === "asc") {
          this.changeSortingDescending(event.column);           
      } else {
          this.changeSorting(event.column); 
      }
  }
  
  filterByName(event) {
      this.filterByNames.emit(event);
  }
  
  onCloseSearchPopup(event) {
      this.openedFilters[event] = false;
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
      //console.log(event.target.innerWidth);
      this.accountTableWidthAccordingToColumsNumber(event.target.innerWidth);
  }  
   
  accountTableWidthAccordingToColumsNumber(width: number) {
      if (width > 1230) {
        switch(this.numberOfColumns) {
            case 9:  
                this.thwidth = "11.7%";
                this.tdwidth = "11.6%";
            break
            case 4:  
                this.thwidth = "31.3%";
                this.tdwidth = "31.2%";
            break
        }
      } else if (width > 1160) {
        switch(this.numberOfColumns) {
            case 9:  
                this.thwidth = "11.7%";
                this.tdwidth = "11.6%";
            break
            case 4:  
                this.thwidth = "31%";
                this.tdwidth = "30.9%";
            break
        }
      } else if (width > 1060) {
        switch(this.numberOfColumns) {
            case 9:  
                this.thwidth = "11.4%";
                this.tdwidth = "11.2%";
            break
            case 4:  
                this.thwidth = "30.6%";
                this.tdwidth = "30.5%";
            break
        }
      } else if (width > 860) {
        switch(this.numberOfColumns) {
            case 9:  
                this.thwidth = "11%";
                this.tdwidth = "10.9%";
            break
            case 4:  
                this.thwidth = "30.3%";
                this.tdwidth = "30.2%";
            break
        }
      } else if (width > 860) {
        switch(this.numberOfColumns) {
            case 9:  
                this.thwidth = "10.6%";
                this.tdwidth = "10.5%";
            break
            case 4:  
                this.thwidth = "29.7%";
                this.tdwidth = "29.6%";
            break
        }
      }
  }
  
}
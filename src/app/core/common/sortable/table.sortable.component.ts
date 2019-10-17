import { Component, Input, Output, EventEmitter, ViewChildren, QueryList } from "@angular/core";
import { TableOrderByPipe } from "./table.sort.orderby.pipe";
import { FormatTablePipe } from "./table.format.pipe";
import { InfoPopupComponent } from "./info.popup.component";
import { Role } from "../../../model/role.model";
import { User } from "../../../model/user.model";
import { Model } from "../../../model/repository.model";
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
  @Output() callUserInputPopup = new EventEmitter();
  @Output() callRoleInputPopup = new EventEmitter();
  @Output() filterByNames = new EventEmitter();
  
  sortArrowsVisible:string = "";
  openedFilter:boolean = false;
  @ViewChildren(TableFilterPopup) tableFilterPopups: QueryList<TableFilterPopup>;
  @ViewChildren(InfoPopupComponent) infoPopups: QueryList<InfoPopupComponent>;
  
  constructor(private model: Model){}
  
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
      if ("NTSID" in item) {
        this.model.deleteUser(item.NTSID);
	window.location.reload();
      } else if ("Rolename" in item) {
        this.model.deleteRole(item.Rolename);
	window.location.reload();
      }
  }
  
  userInput(user: User) {
      this.callUserInputPopup.emit(user);
  }
  
  /*role that arrives from from html table doesn't have enough fields, thats why I have to find real objects in table and send them*/
  roleInput(role: object) {
      let roleWithAllNeededFields;
      this.data.forEach((rol) => {
          if ((rol["Applications"] === rol["Applications"]) && (rol["Rolename"] === role["Rolename"])) {
            roleWithAllNeededFields = rol;
          }
      });
      this.callRoleInputPopup.emit(roleWithAllNeededFields);
  }
  
  openFilter(columnName: string, event) {
      this.openedFilter = true;
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
      this.openedFilter = false;
  }
}
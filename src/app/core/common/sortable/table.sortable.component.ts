import { Component, Input, Output, EventEmitter, ViewChildren, QueryList } from "@angular/core";
import { TableOrderByPipe } from "./table.sort.orderby.pipe"
import { FormatTablePipe } from "./table.format.pipe"
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
  
  sortArrowsVisible:string = "";
  openedFilter:string = "";
  @ViewChildren(TableFilterPopup) tableFilterPopups: QueryList<TableFilterPopup>
  
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
      this.openedFilter = columnName;
      let chosenColumnModalWindow = this.tableFilterPopups.filter((element, index) => element.column === columnName);console.log(this.sortArrowsVisible)
      chosenColumnModalWindow[0].openModalDialog(this.sortArrowsVisible);
      event.stopPropagation();
  }
  
  giveMeMore(showMore: string) {
      let elem = document.getElementById(showMore) as HTMLElement;
     // elem.disabled = true;
      console.log("dlfjie"+JSON.stringify(elem))
  }
  
  callSortingOfTable(event) {
      if (event.order === "asc") {
          this.changeSortingDescending(event.column);           
      } else {
          this.changeSorting(event.column); 
      }
  }
}
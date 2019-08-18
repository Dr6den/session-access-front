import { Component, Input } from "@angular/core";
import { TableOrderByPipe } from "./table.sort.orderby.pipe"
import { FormatTablePipe } from "./table.format.pipe"
import { Role } from "../../../model/role.model";
import { User } from "../../../model/user.model";
import { Model } from "../../../model/repository.model";

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
  
  constructor(private model: Model){}
  
  selectedClass(columnName): string{
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
}
import { Component, Input } from "@angular/core";
import { TableOrderByPipe } from "./table.sort.orderby.pipe"
import { FormatTablePipe } from "./table.format.pipe"

@Component({
  selector: 'table-sortable',
  templateUrl: 'table.sortable.component.html'
})
export class TableSortable {
  
  @Input() columns: any[];
  @Input() data: any[];
  @Input() sort: any;
  
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
  
  funfor(st: string): string{
      return "<div>"+st+"</div>" + "<div>e</div>";
  }
}
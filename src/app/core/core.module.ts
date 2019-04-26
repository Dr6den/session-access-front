import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { ModelModule } from "../model/model.module";
import { TableComponent } from "./table.component";
import { SendRoleFormComponent } from "./send.role.form.component";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SelectModule } from 'ng-select';
import { RouterModule } from "@angular/router";

@NgModule({
    imports: [BrowserModule, FormsModule, ModelModule, RouterModule, NgMultiSelectDropDownModule.forRoot(), SelectModule],
    declarations: [TableComponent, SendRoleFormComponent],
    exports: [ModelModule, TableComponent, SendRoleFormComponent],
})
export class CoreModule { }

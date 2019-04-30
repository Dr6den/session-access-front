import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { ModelModule } from "../model/model.module";
import { TableComponent } from "./table.component";
import { SendRoleFormComponent } from "./send.role.form.component";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgSelectModule } from 'ng-custom-select';
import { RouterModule } from "@angular/router";

@NgModule({
    imports: [BrowserModule, FormsModule, ModelModule, RouterModule, NgMultiSelectDropDownModule.forRoot(), NgSelectModule],
    declarations: [SendRoleFormComponent, TableComponent],
    exports: [ModelModule, SendRoleFormComponent, TableComponent],
})
export class CoreModule { }

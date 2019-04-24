import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ModelModule } from "./model/model.module";
import { CoreModule } from "./core/core.module";
import { TableComponent } from "./core/table.component";
import { FormComponent } from "./core/form.component";
import { InsertionRolesComponent } from './insertion.roles.component';
import { routing } from "./insertion.roles.routing";

@NgModule({
    imports: [BrowserModule, ModelModule, CoreModule, routing],
    declarations: [InsertionRolesComponent],
    bootstrap: [InsertionRolesComponent]
})
export class MainModule { }

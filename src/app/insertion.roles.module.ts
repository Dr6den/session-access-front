import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ModelModule } from "./model/model.module";
import { CoreModule } from "./core/core.module";
import { InsertionRolesComponent } from './insertion.roles.component';
import { routing } from "./application.routing";

@NgModule({
    imports: [BrowserModule, ModelModule, CoreModule, routing],
    declarations: [InsertionRolesComponent],
    bootstrap: [InsertionRolesComponent]
})
export class InsertionRolesModule { }

import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { ModelModule } from "../model/model.module";
import { IndexComponent } from "./index.component";
import { SendRoleFormComponent } from "./send.role.form.component";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgSelectModule } from 'ng-custom-select';
import { RouterModule } from "@angular/router";

@NgModule({
    imports: [BrowserModule, FormsModule, ModelModule, RouterModule, NgMultiSelectDropDownModule.forRoot(), NgSelectModule],
    declarations: [SendRoleFormComponent, IndexComponent],
    exports: [ModelModule, SendRoleFormComponent, IndexComponent],
})
export class CoreModule { }

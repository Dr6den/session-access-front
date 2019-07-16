import { NgModule, Component } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { ModelModule } from "../model/model.module";
import { IndexComponent } from "./index.component";
import { CreateUserComponent } from "./create.user.form.component";
import { SendRoleFormComponent } from "./send.role.form.component";
import { UsersTableComponent } from "./users.table.component";
import { RolesTableComponent } from "./roles.table.component";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgSelectModule } from 'ng-custom-select';
import { RouterModule } from "@angular/router";
import 'bootstrap/dist/css/bootstrap.css';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { HeaderComponent } from "./common/app.header.component"


@NgModule({
    imports: [BrowserModule, FormsModule, ModelModule, RouterModule, NgMultiSelectDropDownModule.forRoot(), NgSelectModule, ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger'
    })],
    declarations: [SendRoleFormComponent, IndexComponent, CreateUserComponent, UsersTableComponent, RolesTableComponent, HeaderComponent],
    exports: [ModelModule, SendRoleFormComponent, IndexComponent, CreateUserComponent, UsersTableComponent, RolesTableComponent],
    bootstrap: [RolesTableComponent]
})
export class CoreModule { }

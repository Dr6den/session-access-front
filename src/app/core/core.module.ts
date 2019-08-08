import { NgModule, Component } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
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
import { HeaderComponent } from "./common/app.header.component";
import { TableFooterComponent } from "./common/footers/table.footer.component";
import { LoginPopupComponent } from '../modalwindows/login.popup.component';
import { ProfilePopupComponent } from '../modalwindows/profile.popup.component';
import { FormatTablePipe } from "./common/sortable/table.format.pipe";
import { TableOrderByPipe } from "./common/sortable/table.sort.orderby.pipe";
import { TableSortable } from "./common/sortable/table.sortable.component";

@NgModule({
    imports: [BrowserModule, FormsModule, ModelModule, RouterModule, NgMultiSelectDropDownModule.forRoot(), NgSelectModule, ReactiveFormsModule,
         ConfirmationPopoverModule.forRoot({
             confirmButtonType: 'danger'
    })],
    declarations: [SendRoleFormComponent, IndexComponent, CreateUserComponent, UsersTableComponent, RolesTableComponent, HeaderComponent,
         LoginPopupComponent, ProfilePopupComponent, TableFooterComponent, FormatTablePipe, TableOrderByPipe, TableSortable],
    providers: [LoginPopupComponent, ProfilePopupComponent, FormatTablePipe, TableOrderByPipe],
    exports: [ModelModule, SendRoleFormComponent, IndexComponent, CreateUserComponent, UsersTableComponent, RolesTableComponent],
    bootstrap: [RolesTableComponent]
})
export class CoreModule { }

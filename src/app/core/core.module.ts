import { NgModule, Component } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ModelModule } from "../model/model.module";
import { IndexComponent } from "./index.component";
import { CreateUserComponent } from "./create.user.form.component";
import { CreateRoleFormComponent } from "./create.role.form.component";
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
import { UserInputPopupComponent } from '../modalwindows/business/user.input.popup.component';
import { RoleInputPopupComponent } from '../modalwindows/business/role.input.popup.component';
import { FormatTablePipe } from "./common/sortable/table.format.pipe";
import { SplitStringAndReturnOneOfPipe } from "./common/sortable/split.string.return.one.contained.pipe";
import { TableOrderByPipe } from "./common/sortable/table.sort.orderby.pipe";
import { TableSortable } from "./common/sortable/table.sortable.component";
import { TabsComponent } from "./common/tabs/tabs.component";
import { TabComponent } from "./common/tabs/tab.component";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [BrowserModule, NgbModule, FormsModule, ModelModule, RouterModule, NgMultiSelectDropDownModule.forRoot(), NgSelectModule, ReactiveFormsModule,
         ConfirmationPopoverModule.forRoot({
             confirmButtonType: 'danger'
    })],
    declarations: [CreateRoleFormComponent, IndexComponent, CreateUserComponent, RolesTableComponent, UsersTableComponent, HeaderComponent,
         LoginPopupComponent, ProfilePopupComponent, TableFooterComponent, FormatTablePipe, TableOrderByPipe, SplitStringAndReturnOneOfPipe,
         TabsComponent, TabComponent, TableSortable, UserInputPopupComponent, RoleInputPopupComponent],
    providers: [LoginPopupComponent, ProfilePopupComponent, FormatTablePipe, TableOrderByPipe, SplitStringAndReturnOneOfPipe,
         IndexComponent, UserInputPopupComponent, RoleInputPopupComponent],
    exports: [ModelModule, CreateRoleFormComponent, CreateUserComponent, RolesTableComponent, UsersTableComponent]
})
export class CoreModule { }

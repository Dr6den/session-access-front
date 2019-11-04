import { NgModule, Component } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ModelModule } from "../model/model.module";
import { IndexComponent } from "./index.component";
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
import { DynamicDropboxComponent } from '../modalwindows/business/dynamic/dynamic.dropbox.component';
import { DynamicInputComponent } from '../modalwindows/business/dynamic/dynamic.input.component';
import { TableFilterPopup } from "../modalwindows/business/sortingfilter/table.filter.popup";
import { FormatTablePipe } from "./common/sortable/table.format.pipe";
import { SplitStringAndReturnOneOfPipe } from "./common/sortable/split.string.return.one.contained.pipe";
import { SplitStringPipe } from "./common/sortable/split.string.pipe";
import { TableOrderByPipe } from "./common/sortable/table.sort.orderby.pipe";
import { TableSortable } from "./common/sortable/table.sortable.component";
import { InfoPopupComponent } from "./common/sortable/info.popup.component";
import { TabsComponent } from "./common/tabs/tabs.component";
import { TabComponent } from "./common/tabs/tab.component";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [BrowserModule, NgbModule, FormsModule, ModelModule, RouterModule, NgMultiSelectDropDownModule.forRoot(), NgSelectModule, ReactiveFormsModule,
         ConfirmationPopoverModule.forRoot({
             confirmButtonType: 'danger'
    })],
    declarations: [IndexComponent, RolesTableComponent, UsersTableComponent, HeaderComponent, InfoPopupComponent, SplitStringPipe, DynamicInputComponent,
         LoginPopupComponent, ProfilePopupComponent, TableFooterComponent, FormatTablePipe, TableOrderByPipe, SplitStringAndReturnOneOfPipe,
         TabsComponent, TabComponent, TableSortable, UserInputPopupComponent, RoleInputPopupComponent, DynamicDropboxComponent, TableFilterPopup],
    providers: [LoginPopupComponent, ProfilePopupComponent, FormatTablePipe, TableOrderByPipe, SplitStringAndReturnOneOfPipe, SplitStringPipe,
         IndexComponent, UserInputPopupComponent, RoleInputPopupComponent, InfoPopupComponent],
    exports: [ModelModule, RolesTableComponent, UsersTableComponent],
    bootstrap: [RoleInputPopupComponent],
    entryComponents: [DynamicInputComponent, DynamicDropboxComponent, TableFilterPopup]
})
export class CoreModule { }

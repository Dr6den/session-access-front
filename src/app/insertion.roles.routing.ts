import { Routes, RouterModule } from "@angular/router";
import { IndexComponent } from "./core/index.component";
import { SendRoleFormComponent } from "./core/send.role.form.component";
import { CreateUserComponent } from "./core/create.user.form.component";
import { RolesTableComponent } from "./core/roles.table.component";
import { UsersTableComponent } from "./core/users.table.component";

const routes: Routes = [
    { path: "form/:mode/:id", component: SendRoleFormComponent },
    { path: "form/:mode", component: SendRoleFormComponent },
    { path: "createUser", component: CreateUserComponent },
    { path: "showUsers", component: UsersTableComponent },
    { path: "showRoles", component: RolesTableComponent },
    { path: "", component: IndexComponent }]

export const routing = RouterModule.forRoot(routes);

import { Routes, RouterModule } from "@angular/router";
import { IndexComponent } from "./core/index.component";
import { SendRoleFormComponent } from "./core/send.role.form.component";
import { CreateUserComponent } from "./core/create.user.form.component";
import { RolesTableComponent } from "./core/roles.table.component";
import { UsersTableComponent } from "./core/users.table.component";
import { AuthGuard } from "./auth/guards/auth.guard";

const routes: Routes = [
    { path: "createRole/:mode/:id", component: SendRoleFormComponent, canActivate: [AuthGuard] },
    { path: "createRole", component: SendRoleFormComponent, canActivate: [AuthGuard] },
    { path: "createUser", component: CreateUserComponent, canActivate: [AuthGuard] },
    { path: "createUser/:mode/:id", component: CreateUserComponent, canActivate: [AuthGuard] },
    { path: "showUsers", component: UsersTableComponent, canActivate: [AuthGuard] },
    { path: "showRoles", component: RolesTableComponent, canActivate: [AuthGuard] },
    { path: "", component: IndexComponent },
    { path: '**', redirectTo: '' }]
    
export const routing = RouterModule.forRoot(routes);

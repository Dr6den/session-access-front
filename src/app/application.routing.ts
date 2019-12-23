import { Routes, RouterModule } from "@angular/router";
import { IndexComponent } from "./core/index.component";
import { UsersTableComponent } from "./core/users.table.component";
import { RolesTableComponent } from "./core/roles.table.component";
import { TemporaryTableComponent } from "./core/temporary.table.component";
import { AuthGuard } from "./auth/guards/auth.guard";

const routes: Routes = [
    { path: "showRoles/Users", component: UsersTableComponent, canActivate: [AuthGuard] },
    { path: "showRoles", component: RolesTableComponent, canActivate: [AuthGuard] },
    { path: "showRoles/:schemeName", component: RolesTableComponent, canActivate: [AuthGuard] },
    { path: "temporaryTable/:schemeName/:temporaryId", component: TemporaryTableComponent, canActivate: [AuthGuard] },
   // { path: "temporaryTable", component: TemporaryTableComponent, canActivate: [AuthGuard],  data :{  validationResponse: "data", scheme: "day"} },
    { path: "", component: IndexComponent },
    { path: "token/:token", component: IndexComponent },
    { path: '**', redirectTo: '' }]
    
export const routing = RouterModule.forRoot(routes);

import { Routes, RouterModule } from "@angular/router";
import { TableComponent } from "./core/table.component";
import { SendRoleFormComponent } from "./core/send.role.form.component";

const routes: Routes = [
    { path: "form/:mode/:id", component: SendRoleFormComponent },
    { path: "form/:mode", component: SendRoleFormComponent },
    { path: "", component: TableComponent }]

export const routing = RouterModule.forRoot(routes);

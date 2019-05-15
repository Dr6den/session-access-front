import { Routes, RouterModule } from "@angular/router";
import { IndexComponent } from "./core/index.component";
import { SendRoleFormComponent } from "./core/send.role.form.component";

const routes: Routes = [
    { path: "form/:mode/:id", component: SendRoleFormComponent },
    { path: "form/:mode", component: SendRoleFormComponent },
    { path: "", component: IndexComponent }]

export const routing = RouterModule.forRoot(routes);

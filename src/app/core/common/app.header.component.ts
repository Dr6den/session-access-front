import { Component, Input } from "@angular/core";

@Component({
    selector: "app-header",
    templateUrl: "app.header.component.html",
    styleUrls: ["app.header.component.css"]
})
export class HeaderComponent {
    disableLogin = false;
    disableLogout = true;

    logout() {
        this.disableLogin = !this.disableLogin;
        this.disableLogout = !this.disableLogout;
    }

    login() {
        this.disableLogin = !this.disableLogin;
        this.disableLogout = !this.disableLogout;
    }
}

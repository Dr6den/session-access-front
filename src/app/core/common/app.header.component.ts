import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../../auth/services/authentication.service";

@Component({
    selector: "app-header",
    templateUrl: "app.header.component.html",
    styleUrls: ["app.header.component.css"]
})
export class HeaderComponent {
    disableLogin = false;
    disableLogout = true;
    disableUsername = true;
    username = "Nadia";
    authService;

    constructor(private activeRoute: ActivatedRoute, private router: Router, private authServiceInj: AuthenticationService) { 
        this.authService = authServiceInj;
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            this.disableLogin = true;
            this.disableLogout = false;
            this.disableUsername = false;
            this.username = currentUser.username;
        } else {
            this.disableLogin = false;
            this.disableLogout = true;
            this.disableUsername = true;
        }
    }
    
    logout() {
        this.authService.logout();
        window.location.reload();
    }

    login() {
        this.router.navigateByUrl("/login");
    }
}

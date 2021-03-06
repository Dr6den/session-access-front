import { Component, Input, ViewChild } from "@angular/core";
import { AuthenticationService } from "../../auth/services/authentication.service";
import { LoginPopupComponent } from "../../modalwindows/login.popup.component";
import { ProfilePopupComponent } from "../../modalwindows/profile.popup.component";

@Component({
    selector: "app-header",
    templateUrl: "app.header.component.html",
    styleUrls: ["app.header.component.css"]
})
export class HeaderComponent {
    @Input('title') title: string;
    @ViewChild(LoginPopupComponent, {static: false}) loginPopup:LoginPopupComponent;
    @ViewChild(ProfilePopupComponent,  {static: false}) profilePopup:ProfilePopupComponent;
    disableLogin = false;
    disableLogout = true;
    disableUsername = true;
    username = "Nadia";

    constructor(private authService: AuthenticationService) {
         
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            this.disableLogin = true;
            this.disableLogout = false;
            this.disableUsername = false;
            this.username = currentUser.name;
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
        this.loginPopup.openModalDialog();
    }
    
    profile() {
        this.profilePopup.openModalDialog();
    }
    
    disableLoginChange(condition) {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.disableLogin = true;
        this.disableLogout = false;
        this.disableUsername = false;
        this.username = currentUser.name;
    }
}

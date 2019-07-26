import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators }  from '@angular/forms';
import { AuthenticationService } from '../auth/services';

@Component({
  selector: 'profile-popup',
  templateUrl: './profile.popup.component.html',
  styleUrls: ['./profile.popup.component.css']
})
export class ProfilePopupComponent {
    display='none'; //default Variable

    constructor(private authenticationService: AuthenticationService) { }


    openModalDialog(){
        this.display='block'; //Set block css
    }

    closeModalDialog(){
        this.display='none'; //set none css after close dialog
    }
 

    
}



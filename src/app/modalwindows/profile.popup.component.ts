import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators }  from '@angular/forms';
import { AuthenticationService } from '../auth/services';

@Component({
  selector: 'profile-popup',
  templateUrl: './profile.popup.component.html',
  styleUrls: ['./profile.popup.component.css']
})
export class ProfilePopupComponent {
    @Input('username') username: string;
    display='none'; //default Variable

    constructor(private authenticationService: AuthenticationService) { }


    openModalDialog(){
        this.display='block'; //Set block css
    }

    closeModalDialog(){
        this.display='none'; //set none css after close dialog
    }
 

    
}



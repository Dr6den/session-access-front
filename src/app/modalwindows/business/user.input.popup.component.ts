import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'user-input-popup',
  templateUrl: './user.input.popup.component.html',
  styleUrls: ['./user.input.popup.component.css']
})
export class UserInputPopupComponent {
    display='none'; //default Variable

    constructor() { }
    
    openModalDialog(){
        this.display='block'; //Set block css
    }

    closeModalDialog(){
        this.display='none'; //set none css after close dialog
    }
}
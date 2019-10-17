import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators }  from '@angular/forms';

@Component({
  selector: 'info-popup',
  templateUrl: './info.popup.component.html',
  styleUrls: ['./info.popup.component.css']
})
export class InfoPopupComponent {
    @Input() data: string;
    @Input() column: string;
    @Input() rowIndex: number;
    display = 'none';
    setTop = '0px';
    setLeft = '0px';
    
    openModalDialog(setTop: string, setLeft: string) {
        this.display='block';
        this.setTop = setTop;
        this.setLeft = setLeft;
    }
    
    closeModalDialog() {console.log("hey")
        this.display='none';
    }
}
import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { TabsComponent } from "../../../core/common/tabs/tabs.component";
import { Model } from "../../../model/repository.model";
import { Router } from "@angular/router";

@Component({
  selector: 'upload-popup',
  templateUrl: './upload.popup.component.html',
  styleUrls: ['./upload.popup.component.css']
})
export class UploadPopupComponent {
    display = 'none';
    uploadPopupError = "error message";
    progressValue = 50;
    levels:Array<string>;
    @ViewChild(TabsComponent, {static: false}) tabs:TabsComponent;
    linesLoaded: number = 100;
    documentName: string;
    uploadResponse: object;
    chooseSheetResponse: object;
    directoryName: string;
    selectedSheet: string;
    
    constructor(private model: Model, private router: Router){}
    
    openModalDialog(response: object, fileName: string) {
        this.display='block'; //Set block css
        this.documentName = fileName;
        this.levels = response["sheets"];
        this.uploadResponse = response;
        this.directoryName = fileName.substring(0, fileName.indexOf("."));
        this.selectedSheet = this.levels[0];
    }
    
    closeModalDialog(){
        this.tabs.firstTab();
        this.progressValue = 33;
        this.display='none'; //set none css after close dialog
    }
    
    selectSheet() {
        this.uploadResponse["sheet"] = this.selectedSheet;
        delete this.uploadResponse["sheets"];
        this.model.uploadScheme(this.uploadResponse, this.directoryName, "sheet").toPromise().then((data) => {
            if(data["message"]) {
                this.uploadPopupError = data["message"];
            } else {
                this.tabs.nextTab();
                this.progressValue = 100;
                this.chooseSheetResponse = data;
                this.linesLoaded = data["records"];
            }
        }).catch((response) => {
            this.uploadPopupError = response;
        });        
    }
    
    validate() {
        this.model.uploadScheme(this.chooseSheetResponse, this.directoryName, "insert").toPromise().then((data) => {
            let url = "/temporaryTable/" + this.directoryName + "/" + this.chooseSheetResponse["importId"];
            
            this.router.navigateByUrl(url);
            this.closeModalDialog();
        }).catch((response) => {
            this.uploadPopupError = response;
        }); 
    }
    
    changeSheet(event) {
        this.selectedSheet = event;
    }
}
import { Component, EventEmitter, Output } from "@angular/core";
import { Tab } from './tab.interface';

@Component({
  selector: 'tabs',
  templateUrl: 'tabs.component.html',
  styleUrls: ["tabs.component.css"]
})
export class TabsComponent {
  tabs:Tab[] = [];

  @Output() selected = new EventEmitter();
  selectedTabName: string;
  
  addTab(tab:Tab) {
    if (!this.tabs.length) {
      tab.selected = true;
      this.selectedTabName = tab.tabTitle;
    }
    this.tabs.push(tab);
  }
  
  selectTab(tab:Tab) {
    this.tabs.map((tab) => {
      tab.selected = false;
    })
    tab.selected = true;
    this.selected.emit({selectedTab: tab});    
  }
  
  nextTab() {
    let num = 0;
    this.tabs.map((tab) => {    
      if (tab.selected) {
          tab.selected = false;
          num = -1;;
      } else {  
          if (num === -1) {
            tab.selected = true;
            this.selectedTabName = tab.tabTitle;
          }
          num++;
      }
    })
  }
  
  firstTab() {
    let num = 0;
    this.tabs.map((tab) => {     
        if (num === 0) {
            tab.selected = true;
            this.selectedTabName = tab.tabTitle;
        } else {
            tab.selected = false;
        }
        num++;
    });
  }
}
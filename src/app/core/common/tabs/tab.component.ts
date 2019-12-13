import { Component, Input, OnInit } from '@angular/core';
import { Tab } from './tab.interface';
import { TabsComponent } from './tabs.component';

@Component({
  selector: 'tab',
  templateUrl: 'tab.component.html',
  styleUrls: ["tab.component.css"]
})
export class TabComponent implements OnInit, Tab {
  @Input() tabTitle;
  @Input() selected: boolean;
  
  constructor(private tabsComponent: TabsComponent) {}
  
  ngOnInit() {
    this.tabsComponent.addTab(this);
  }
}


import {
	Component,
	ContentChildren,
	QueryList,
	AfterContentInit
} from '@angular/core';

import { TabComponent } from './Tab.component';

import {EntryExitLogger,Loggable} from '../common/Common.module';
@Loggable("app.tabs")
@Component({
	selector: 'tabs',
	templateUrl: './Tabs.component.html',
	styleUrls: ['./Tabs.component.css']
})
export class TabsComponent implements AfterContentInit {

	@ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

	private activeTab:TabComponent;

	@EntryExitLogger
	ngAfterContentInit(){

		let activeTabs = this.tabs.filter((tab)=>tab.active);

		if(activeTabs.length === 0) {
			this.selectTab(this.tabs.first);
		}
	}
	// contentChildren are set
	// @EntryExitLogger
	// ngOnChanges(changes:SimpleChanges) {
	// 	console.debug("TabsComponent - ngOnChanges",changes);
	// 	// get the active tab
	// 	// this.activeTab = this.getActiveTab();

	// 	// console.debug("ngAfterContentInit",this);

	// 	// //if there is no active tab set, activate the first
	// 	// if(typeof this.activeTab === 'undefined') {
	// 	//
	// 	// 	}else{
	// 	// 		this.selectTab(this.tabs.first);
	// 	// 	}
	// 	// }
	// }
	@EntryExitLogger
	selectTab(tab: TabComponent){
		//deactivate all tabs
		this.tabs.toArray().forEach(tab => tab.active = false);
		tab.active = true;
	}
}

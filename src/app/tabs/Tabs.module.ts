import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';

import { CommonModule } from '../common/Common.module';

import { TabsComponent } from './Tabs.component';
import { TabComponent } from './Tab.component';

export * from './Tabs.component';
export * from './Tab.component';

@NgModule({
	imports: [
		BrowserModule,
		CommonModule
	],
	declarations: [
		TabsComponent,
		TabComponent
	],
	exports:[TabComponent,TabsComponent]
})
export class TabsModule { }

import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';

import { CommonModule } from '../common/Common.module';

import { TabsModule } from '../tabs/Tabs.module';
import {
	FileModule,
	FileSelectorComponent,
	FilterFileComponent,
	JSONFileComponent,
	CsvFileComponent
} from '../file/File.module';

import { MenuComponent } from './Menu.component';

export * from './Menu.component';

@NgModule({
	imports: [
		BrowserModule,
		CommonModule,
		TabsModule,
		FileModule
	],
	entryComponents: [
		FileSelectorComponent,
		FilterFileComponent,
		JSONFileComponent,
		CsvFileComponent
	],
	declarations: [
		MenuComponent
	],
	exports:[MenuComponent]
})
export class MenuModule {}

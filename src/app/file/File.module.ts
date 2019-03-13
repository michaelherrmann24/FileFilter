import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';

import { CommonModule } from '../common/Common.module';

import { FileSelectorComponent } from './fileselector/FileSelector.component';
import { DropZoneDirective } from './fileselector/DropZone.directive';

import { FilterFileComponent } from './filter/FilterFile.component';
import { CsvFileComponent } from './csv/CsvFile.component';
import { JSONFileComponent } from './json/JSONFile.component';

export * from './fileselector/FileSelector.component';
export * from './fileselector/DropZone.directive';
export * from './filter/FilterFile.component';
export * from './csv/CsvFile.component';
export * from './json/JSONFile.component';

@NgModule({
	imports: [
		BrowserModule,
		CommonModule
	],
	declarations: [
		FileSelectorComponent,
		FilterFileComponent,
		JSONFileComponent,
		CsvFileComponent,
		DropZoneDirective
	],
	providers:[],
	exports:[
		FileSelectorComponent,
		FilterFileComponent,
		JSONFileComponent,
		CsvFileComponent,
		DropZoneDirective
	]
})
export class FileModule {}

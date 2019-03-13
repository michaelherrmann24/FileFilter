import { NgModule} from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule }  from '@angular/platform-browser';

import { CommonModule } from './common/Common.module';
import { ReactiveModule,RootStore} from './reactive/Reactive.module';
import { TabsModule } from './tabs/Tabs.module';
import { MenuModule } from './menu/Menu.module';
import { FileModule } from './file/File.module';

import { IndexModule } from './index/Index.module';
import { StateModule,ApplicationState } from './state/State.module';

import { FileFilterComponent } from './FileFilter.component';


@NgModule({
	imports: [
		HttpModule,
		BrowserModule,
		CommonModule,
		ReactiveModule,
		StateModule,
		TabsModule,
		MenuModule,
		FileModule,
		IndexModule
	],
	declarations: [
		FileFilterComponent
	],
	providers:[
		{provide: RootStore, useValue: new ApplicationState()}
	],
	bootstrap:[
		FileFilterComponent
	]
})
export class FileFilterModule { }

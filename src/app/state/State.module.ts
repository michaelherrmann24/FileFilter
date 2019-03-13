import { NgModule } from '@angular/core';

import { FileService } from './services/File.service';
import { IndexService } from './services/Index.service';

export * from './ApplicationState';
export * from './IndexState';
export * from './FileState';
export * from './Chapter';

export * from './services/File.service';
export * from './services/Index.service';

export * from './actions/AddFiles.action';
export * from './actions/AddIndexes.action';
export * from './actions/SelectFile.action';

@NgModule({
	imports: [],
	providers:[
		FileService,
		IndexService
	],
	declarations: []
})
export class StateModule { }



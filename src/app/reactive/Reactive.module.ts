import { NgModule } from '@angular/core';

import {DispatcherService} from "./Dispatcher.service";
import {ReducerService} from "./Reducer.service";
import {StoreService} from "./Store.service";
import {ActionMapService} from "./ActionMap.service";


export * from "./decorators/Actions.decorator";
export * from "./decorators/SubStore.decorator";

export * from "./Dispatcher.service";
export * from "./Reducer.service";
export * from "./Store.service";

export * from "./Store.interface";
export * from "./Action.interface";

export * from './ActionMap';

@NgModule({
	imports:[],
	providers:[
		DispatcherService,
		ReducerService,
		StoreService,
		ActionMapService
	]
	})
export class ReactiveModule { }

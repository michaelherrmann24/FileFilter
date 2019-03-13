import { Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import {DispatcherService} from './Dispatcher.service';
import {ReducerService} from './Reducer.service';

import {Store,RootStore} from './Store.interface';
import {Action} from './Action.interface';

import {EntryExitLogger,Loggable} from '../common/Common.module';

@Loggable("app.reactive")
@Injectable()
export class StoreService{

	private store: BehaviorSubject<Store>;

	constructor(private dispatcherService:DispatcherService,private reducerService:ReducerService,private initStore:RootStore){

		this.store = new BehaviorSubject<Store>(initStore);
		//wire up the dispatcher to the store.
		this.dispatcherService.getActions()
		.scan(this.reducerService.reduce.bind(this.reducerService), this.store.getValue())
		.subscribe(this.store);
	}

	@EntryExitLogger
	getStore():Observable<Store>{
		return this.store.asObservable();
	}
}

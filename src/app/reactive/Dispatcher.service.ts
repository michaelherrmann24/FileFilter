import { Injectable,OnInit} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import {EntryExitLogger,Loggable} from '../common/Common.module';

import {Store,RootStore} from "./Store.interface";
import {Action} from "./Action.interface";

@Loggable("app.reactive")
@Injectable()
export class DispatcherService{

	private dispatcher:Subject<Action[]> = new Subject<Action[]>();

	constructor(){}

	dispatch(...action:Action[]){
		this.dispatcher.next(action);
	}

	getActions(){
		return this.dispatcher.asObservable();
	}
}

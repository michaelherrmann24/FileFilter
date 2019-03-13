import { Injectable,OnInit} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import {EntryExitLogger,Loggable} from '../common/Common.module';

import {Store} from "./Store.interface";
import {Action} from "./Action.interface";

import {ActionMapService} from "./ActionMap.service";
import {ActionMap} from './ActionMap';

@Loggable("app.state")
@Injectable()
export class ReducerService{

	private actionMap:ActionMap;

	constructor(private actionMapService:ActionMapService){
		this.actionMap = this.actionMapService.getActionMap();
	}

	@EntryExitLogger
	reduce(state:Store,actions:Action[]):Store{
		return actions.reduce((acc:Store,action:Action)=>{
			return <Store>Object.assign(acc, this.accumulate(acc,action,this.actionMap));
		},state);
	}

	@EntryExitLogger
	private accumulate(state:Store,action:Action,actionMap:ActionMap):Store{
		let actionName = action.constructor.name;
		let newState:Store = state;

		//apply the action to children first
		if(actionMap.hasChildAction(actionName)){
			//execute accumulate on each of the child objects in the actionMap merging the results into the newState
			actionMap.children.reduce(function(action:Action,store:Store,actionMap:ActionMap){

				let nextStoreLevel:Store = store[actionMap.name];
				let updatedNextLevelStore:Store = this.accumulate(nextStoreLevel,action,actionMap);

				let partial:Object = {};
				partial[actionMap.name] = updatedNextLevelStore;

				return <Store>Object.assign(store, partial);

			}.bind(this,action),newState);

		}


		if(actionMap.hasAction(actionName)){
			//apply the action to this Store
			newState = action.execute(state);
		}
		return newState;
	}
}

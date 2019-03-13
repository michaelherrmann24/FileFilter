import { Injectable} from '@angular/core';
import "reflect-metadata";

import {EntryExitLogger,Loggable} from '../common/Common.module';

import {Action} from './Action.interface';
import {Store,RootStore} from './Store.interface';

import {ActionMap} from './ActionMap';

class ObjectEntry{
	key:string;
	value:any;
	constructor(key:string,value:any){
		this.key = key;
		this.value = value;
	}
}

@Loggable("app.reactive")
@Injectable()
export class ActionMapService{

	private actionMap:ActionMap;

	constructor(private initStore:RootStore){
		this.actionMap = this.populateActionMap("root",this.initStore);
	}

	getActionMap():ActionMap{
		return this.actionMap;
	}

	@EntryExitLogger
	private populateActionMap(storeName:string,store:Store):ActionMap{

		let actions:string[] = this.getActions(store);
		let actionMap = new ActionMap(storeName,actions);

		let result = Reflect.getMetadataKeys(store.constructor);

		let storeKeys = result.filter(this.hasStoreKey).map(this.getStoreKey);
		let storeArrKeys = result.filter(this.hasStoreArrayKey).map(this.getStoreArrayKey);

		let childStoreActionMaps:ActionMap[] = storeKeys.map(function(store:Object,key:string){
			let objEntry:ObjectEntry=new ObjectEntry(key,store[key]);
			return objEntry
		}.bind(this,store))
		.map((entry:ObjectEntry)=>{
			console.log("about to enter populate ",entry.key,entry.value);
			return this.populateActionMap(entry.key,entry.value);
		 });

		let childStoreArrayActionMaps:any[] = storeArrKeys.map(function(store:Object,key:string){
			//need to create a new instance of the object to check based on the metaKey Property
			let storeConstructor:typeof Object = this.getStoreArrayValue(key,store);
			let storeObj:Store = new storeConstructor();
			return new ObjectEntry(key,storeObj);
		}.bind(this,store))
		.map((entry:ObjectEntry)=>{
			return this.populateActionMap(entry.key,entry.value);
		});

		// concatenate the 2 types of children together.
		actionMap.children = childStoreActionMaps.concat(childStoreArrayActionMaps);

		let childActions:string[] = actionMap.children.reduce(function(acc:string[],actionMap:ActionMap){
			return acc.concat(actionMap.actions,actionMap.childActions);
		},[]);

		actionMap.childActions = childActions;

		return actionMap;
	}

	@EntryExitLogger
	private getActions(store:Store):string[]{
		if(Reflect.hasMetadata("actions", store.constructor)){
			return Reflect.getMetadata("actions", store.constructor);
		}
		return [];
	}

	private hasStoreKey(meta:string){
		return meta.startsWith("SubStore_");
	}
	private hasStoreArrayKey(meta:string){
		return meta.startsWith("SubStoreArray_");
	}

	private getStoreKey(meta:string){
		return meta.replace("SubStore_","");
	}

	private getStoreArrayKey(meta:String){
		return meta.replace("SubStoreArray_","");
	}
	private getStoreArrayValue(propertyKey:String,store:Store):string{
		return Reflect.getMetadata("SubStoreArray_" + propertyKey,store.constructor);
	}

}




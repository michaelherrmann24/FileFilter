import { ReflectiveInjector } from '@angular/core';
import "reflect-metadata";

export function SubStore():any{
	return (target: Object,propertyKey:string, descriptor: any)=>{
		Reflect.defineMetadata("SubStore_"+propertyKey, "", target.constructor);
		return target;
	}
}

export function SubStoreArray(type:any):any{
	return (target: Object,propertyKey:string, descriptor: any) => {
		if(typeof type !== 'undefined'){
			Reflect.defineMetadata("SubStoreArray_"+propertyKey, type, target.constructor);
		}
		return target;
	}
}

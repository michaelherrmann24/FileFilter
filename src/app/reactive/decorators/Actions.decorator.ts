import { ReflectiveInjector } from '@angular/core';
import "reflect-metadata";

import { Action } from "../Action.interface";
import { Store } from "../Store.interface";

export function Actions(...actions:string[]):any{
	return (target: Function,propertyKey:string, descriptor: any) => {
		Reflect.defineMetadata("actions", actions, target);
		return target;
	}
}


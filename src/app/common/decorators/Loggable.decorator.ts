import { ReflectiveInjector } from '@angular/core';

import "reflect-metadata";
import {Logger} from "../utils/Logger";
import {LocalStorage} from "../utils/storage/LocalStorage";

export function Loggable(path: string):any{
	return (target: Function) => {
		var injector = ReflectiveInjector.resolveAndCreate([LocalStorage]);
		var localStorage = injector.get(LocalStorage);

		Reflect.defineMetadata("logger", new Logger(path + "." + target.name,localStorage), target);
		return target;
	}
}

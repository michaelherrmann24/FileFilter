import "reflect-metadata";
import { Observable }     from 'rxjs/Observable';
import { Logger } from '../utils/Logger';

/**
 * An annotation which can be applied to any function or property of a class.
 * It will log the entry and exit values for functions.
 * For observables and promises it will log notify value when a value is returned by the Promise/Observable
 * it will log entry values for property setters
 * and exit values or property getters
 *
 * @param {Function|Object} target      [description]
 * @param {string}          propertyKey [description]
 * @param {any}             descriptor  [description]
 */
export function EntryExitLogger(target:Function|Object,propertyKey:string, descriptor: any){

	if(typeof descriptor.value !== 'undefined'){
		var original = descriptor.value;

		descriptor.value = function loggingFn(...args:any[]){
			let logger:Logger;
			let method:string = propertyKey;

			let targetConstructor:Function = getConstructor(target);

			if(Reflect.hasMetadata("logger", targetConstructor)){
				logger = Reflect.getMetadata("logger",targetConstructor);
			}

			logEntry(logger,method,args);
			var result = original.apply(this,args);

			if(result instanceof Observable){
				result = result.do((d:any)=>{
					logNotify(logger,method,d);
				});
			}else if(result instanceof Promise){
				result = result.then((r:any)=>{
					logNotify(logger,method,r);
					return r;
				});
			}

			logExit(logger,method,result);
			return result;
		}
	}


	if(typeof descriptor.get !== 'undefined'){
		var originalGet = descriptor.get;
		descriptor.get = function(){
			let logger:Logger;
			let method:string = "get " + propertyKey;

			let targetConstructor:Function = getConstructor(target);

			if(Reflect.hasMetadata("logger", targetConstructor)){
				logger = Reflect.getMetadata("logger",targetConstructor);
			}

			logEntry(logger,method,undefined);
			var result = originalGet.apply(this);
			logExit(logger,method,result);

			return result;
		}
	}

	if(typeof descriptor.set !== 'undefined'){
		var originalSet = descriptor.set;
		descriptor.set = function(arg:any){
			let logger:Logger;
			let method:string = "set " + propertyKey;

			let targetConstructor:Function = getConstructor(target);

			if(Reflect.hasMetadata("logger", targetConstructor)){
				logger = Reflect.getMetadata("logger",targetConstructor);
			}

			logEntry(logger,method,arg);
			originalSet.apply(this);
			logExit(logger,method,undefined);
		}
	}

	function logEntry(logger:Logger, method:string, args:any[]){
		if(logger){
			logger.enter(method, args);
		}

	}

	function logNotify(logger:Logger, method:string, args:any){
		if(logger){
			logger.notify(method, args);
		}
	}

	function logExit(logger:Logger, method:string, args:any){
		if(logger){
			logger.exit(method, args);
		}
	}

	function getConstructor(target:Function|Object):Function{

		if(typeof target === 'object'){
			return target.constructor;
		}
		return <Function>target;
	}

	return descriptor;
}


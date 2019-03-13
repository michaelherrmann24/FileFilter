import { Inject,Injectable } from '@angular/core';
import { Storage } from "./storage/AbstractStorage";

export class Logger{

	path:string;
	storage:Storage;

	constructor(path:string,storage:Storage){
		this.path = path;
		this.storage = storage;
	}

	canLog():boolean{
		if(this.storage.isAvailable()){
			let tracePaths:string[] = this.storage.get("trace");
			if(tracePaths){
				return tracePaths.reduce(function(prev:boolean,current:string,index:number){
					if(prev){
						return prev;
					}else{
						return this.path.startsWith(current);
					}

				}.bind(this),false);
			}
		}

		return false;
	}

	log(msg:string,args:any[]):void{
		if(this.canLog()){
			if(typeof args !== 'undefined'){
				let isIterable:boolean = (typeof args[Symbol.iterator] === 'function');
				if(isIterable && args.length > 0){
					console.log(msg,args);
				}else if(isIterable){
					console.log(msg);
				}else{
					console.log(msg,args);
				}
			}else{
				console.log(msg);
			}

		}
	}

	enter(method:string,args:any[]):void{
		if(this.canLog()){
			let group:string = [this.path,method].join(".");
			this.log(group+"\tENTER\t",args);
		}
	}

	exit(method:string,args:any[]):void{
		if(this.canLog()){
			let group:string = [this.path,method].join(".");
			this.log(group+"\tEXIT\t",args);
		}
	}

	notify(method:string,args:any[]):void{
		if(this.canLog()){
			let group:string = [this.path,method].join(".");
			this.log(group+"\tNOTIFY\t",args);
		}
	}
}

export class Trace{
	traceStrings:string[];

	constructor(){}

	clear():void{
		this.traceStrings = [];
	}
	add(path:string):void{
		if(!this.traceStrings){
			this.traceStrings = [];
		}
		this.traceStrings.push(path);
	}

	getTrace():string[]{
		return this.traceStrings;
	}
}

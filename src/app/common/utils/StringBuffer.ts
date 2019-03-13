export class StringBuffer{
	private buffer:string[] = [];

	constructor(initial?:string){

		if(initial){
			this.buffer.push(initial);
		}
	}

	append(value:string):void{
		this.buffer.push(value);
	}
	toString():string{
		return this.buffer.join("");
	}
}

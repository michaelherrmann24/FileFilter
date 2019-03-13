
export abstract class Storage{

	protected storage: any;

	isAvailable():boolean{
		return (this.storage)?true:false;
	}
	get(key:string):any{
		var value = this.storage.getItem(key);
		return this.fromJson(value);
	}
	set(key:string,value:any):void{
		var stringValue = this.toJson(value);
		this.storage.setItem(key,stringValue);
	}
	delete(key:string):void{
		this.storage.removeItem(key);
	}
	deleteAll():void{
		this.storage.clear();
	}
	private toJson(value:any):string{
		return JSON.stringify(value);
	}
	private fromJson(value:string):any{
		return JSON.parse(value);
	}
}

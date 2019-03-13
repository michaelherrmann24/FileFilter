export class ActionMap{

	actions:string[];
	childActions:string[] = [];
	name:string;

	children:ActionMap[] = [];

	constructor(name:string,actions:string[]){
		this.name = name;
		this.actions = (typeof actions === 'undefined')?[]:actions;
	}

	hasAction(action:string):boolean{
		return this.actions.indexOf(action) > -1
	}

	hasChildAction(action:string):boolean{
		return this.childActions.indexOf(action) > -1;
	}
}

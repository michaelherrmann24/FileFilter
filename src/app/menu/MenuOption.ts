import { Component,ComponentFactory,ComponentFactoryResolver} from '@angular/core';

export class MenuOption {

	component:ComponentFactory<any>;
	icon:string

	constructor(componentFactoryResolver: ComponentFactoryResolver,component:any,icon:string){
		this.component = componentFactoryResolver.resolveComponentFactory(component);
		this.icon = icon;
	}

}

import { Component,
	Input,
	ViewChild,
	ContentChild,
	ComponentFactoryResolver,
	ComponentFactory,
	ViewContainerRef,
	ComponentRef,
	SimpleChanges,
	OnDestroy
} from '@angular/core';

import {TabsComponent} from "./Tabs.component";
import {EntryExitLogger,Loggable} from '../common/Common.module';

@Loggable('app.tab')
@Component({
	selector: 'tab',
	templateUrl: './Tab.component.html',
	styleUrls: ['./Tab.component.css']
})
export class TabComponent{

	@Input('icon') icon: string;

	public active:boolean = false;

	constructor(){}
}

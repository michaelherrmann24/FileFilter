import { Component,ComponentFactory,ComponentFactoryResolver,AfterViewInit} from '@angular/core';

import {EntryExitLogger} from '../common/Common.module';

import {
	FileSelectorComponent,
	FilterFileComponent,
	JSONFileComponent,
	CsvFileComponent,
	} from '../file/File.module';

import {MenuOption} from './MenuOption';

@Component({
	selector: 'menu',
	templateUrl: './Menu.component.html',
	styleUrls: ['./Menu.component.css']
})
export class MenuComponent {

}

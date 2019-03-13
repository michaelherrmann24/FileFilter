import { Component,OnInit} from '@angular/core';

import {IndexGeneratorService} from "./index/Index.module";

import {EntryExitLogger,Loggable} from './common/Common.module'

@Loggable("app")
@Component({
	selector: 'file-filter',
	templateUrl: './FileFilter.component.html',
	styleUrls: ['./FileFilter.component.css']
})
export class FileFilterComponent implements OnInit{

	constructor(private indexGenerator:IndexGeneratorService){}

	@EntryExitLogger
	ngOnInit(){
		this.indexGenerator.init();
	}
}

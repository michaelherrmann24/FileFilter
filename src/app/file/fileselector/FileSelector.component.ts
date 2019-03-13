import {Component,OnInit} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import {EntryExitLogger,Loggable} from '../../common/Common.module';
import { DispatcherService,Action} from '../../reactive/Reactive.module';
import {
	FileState,IndexState,
	FileService,IndexService,
	AddFilesAction,SelectFileAction
} from '../../state/State.module';

@Loggable("app.file.fileselector")
@Component({
	selector: 'file-selector',
	templateUrl: './FileSelector.component.html',
	styleUrls:['./FileSelector.component.css']
})

export class FileSelectorComponent{

	private files:Observable<File[]>;
	private selected:Observable<File>;

	constructor(private fileService:FileService,private indexService:IndexService,private dispatcherService:DispatcherService){}

	@EntryExitLogger
	ngOnInit(){
		this.files = this.fileService.getFiles();
		this.selected = this.fileService.getSelected();
	}

	@EntryExitLogger
	getProgress(file:File):Observable<number>{
		return this.indexService.getFileIndex(file)
			.map((index:IndexState)=>{
				return (typeof index === 'undefined')?index:index.processed;
			});
	}

	@EntryExitLogger
	receiveFiles(data:DataTransfer):void{

		if(typeof data.files !== 'undefined' && data.files.length > 0){
			let files:File[] = [];
			for (let i = 0; i < data.files.length; i++){
				files.push(data.files.item(i));
			}

			this.dispatcherService.dispatch(new AddFilesAction(files));
		}
	}

	@EntryExitLogger
	selectFile(file:File):void{
		this.dispatcherService.dispatch(new SelectFileAction(file));
	}
}

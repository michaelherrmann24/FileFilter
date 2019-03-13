import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import {EntryExitLogger,Loggable} from '../../common/Common.module';
import {Store,StoreService} from '../../reactive/Reactive.module';

import {FileState} from '../FileState';
import {ApplicationState} from '../ApplicationState';

/**
 * place the store the current state of the application. in particular the currently selected file
 *
 */
@Loggable("app.file")
@Injectable()
export class FileService{

	constructor(private storeService:StoreService){}

	@EntryExitLogger
	getFiles():Observable<File[]>{
		return this.getFileState().map((fileState:FileState)=>{return fileState.files;}).distinctUntilChanged();
	}

	@EntryExitLogger
	getSelected():Observable<File>{
		return this.getFileState().map((fileState:FileState)=>{return fileState.selected;}).distinctUntilChanged();
	}

	private getFileState():Observable<FileState>{
		return this.storeService.getStore().map((state:Store)=>{
			return (<ApplicationState>state).fileState;
		});
	}
}


import {EntryExitLogger,Loggable} from '../../common/Common.module';
import {Action,Store} from "../../reactive/Reactive.module";

import {FileState} from "../FileState";

@Loggable("app.file.fileselector.actions")
export class AddFilesAction implements Action{

	private files:File[];

	constructor(files:File[]){
		this.files = files;
	}

	@EntryExitLogger
	execute(store:Store):Store{
		if(store instanceof FileState){
			let newFiles:File[] = this.files.filter(this.newFiles.bind(this,<FileState>store));

			return <Store>Object.assign(store, {files:store.files.concat(newFiles)});
		}
		return store;
	}

	private newFiles(store:FileState,file:File):boolean{
		let f:File = store.files.find(this.isFile.bind(this,file));
		return typeof f === 'undefined';
	}

	private isFile(file:File,newFile:File):boolean{
		return newFile.name === file.name;
	}
}

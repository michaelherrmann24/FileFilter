import {Action,Store} from "../../reactive/Reactive.module";
import {EntryExitLogger,Loggable} from '../../common/Common.module';

import {FileState} from "../FileState";

@Loggable("app.file.fileselector.actions")
export class SelectFileAction implements Action{

	private file:File;
	constructor(file:File){
		this.file = file;
	}

	@EntryExitLogger
	execute(store:Store):Store{
		if(store instanceof FileState){
			return <Store>Object.assign(store, {selected:this.file});
		}
		return store;
	}
}

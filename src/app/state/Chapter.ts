import {Store,Actions,SubStoreArray} from "../reactive/Reactive.module";
import { FileEntry } from "../common/Common.module";

@Actions("UpdateChapterAction")
export class Chapter implements Store{

	lines:number;
	fileEntry:FileEntry;

	constructor(fileEntry?:FileEntry){
		this.fileEntry = fileEntry;
	}

}

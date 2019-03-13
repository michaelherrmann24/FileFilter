
import {Store,SubStoreArray,Actions} from "../reactive/Reactive.module";

import { Chapter } from "./Chapter";

@Actions("AddChapterAction","UpdateProcessedAction")
export class IndexState implements Store{

	file:File;
	processed:number = 0;

	//@SubStoreArray(Chapter)
	chapters:Chapter[] = [];

	constructor(file?:File){
		if(file){
			this.file = file;
		}
	}
}

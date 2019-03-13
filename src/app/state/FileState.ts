
import {Store,Actions} from "../reactive/Reactive.module";

@Actions("SelectFileAction","AddFilesAction")
export class FileState implements Store{
	selected:File;
	files:File[] = [];
}


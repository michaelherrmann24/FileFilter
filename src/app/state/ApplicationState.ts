
import {Store,SubStore,SubStoreArray,Actions} from "../reactive/Reactive.module";

import {FileState} from "./FileState";
import {IndexState} from "./IndexState";

@Actions("AddIndexesAction")
export class ApplicationState implements Store{

	@SubStore()
	fileState:FileState = new FileState();

	@SubStoreArray(IndexState)
	indexes:IndexState[] = [];
}

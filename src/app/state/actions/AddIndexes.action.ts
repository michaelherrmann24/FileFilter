import {Action,Store} from "../../reactive/Reactive.module";
import {IndexState} from "../IndexState";
import {ApplicationState} from "../../state/State.module";
import {EntryExitLogger,Loggable} from '../../common/Common.module';

@Loggable("app.index.actions")
export class AddIndexesAction implements Action{

	private indexes:IndexState[];

	constructor(indexes:IndexState[]){
		this.indexes = indexes;
	}

	@EntryExitLogger
	execute(store:Store):Store{
		if(store instanceof ApplicationState){
			return <Store>Object.assign(store, {indexes:store.indexes.concat(this.indexes)});
		}
		return store;
	}

}

import {Store} from "./Store.interface";

export interface Action{
	execute(store:Store):Store
}

import {Entry} from "./Entry.interface";

export interface DirectoryEntry extends Entry{

	createReader():any;
	getDirectory(filePath:string,options:any,successCallback:any,errorCallback:any):any;
	getFile(filePath:string,options:any,successCallback:any,errorCallback:any):any;
	removeRecursively():any;

}

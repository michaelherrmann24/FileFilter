import {DomFileSystem} from "./DomFileSystem.interface";

export interface Entry{

	filesystem:DomFileSystem;
	fullPath:string;
	isDirectory:boolean;
	isFile:boolean;
	name:string;

	copyTo():any;
	getParent():any;
	getMetadata():any;
	moveTo():any;
	remove():any;
	toURL():any;
}

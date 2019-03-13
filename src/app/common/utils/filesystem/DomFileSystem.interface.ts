import {DirectoryEntry} from "./DirectoryEntry.interface";

export interface DomFileSystem{
	name:string;
	root:DirectoryEntry;
}

import {Entry} from "./Entry.interface";

export interface FileEntry extends Entry{
	file():File;
	createWriter():any;
}

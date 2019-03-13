import { NgModule } from '@angular/core';

import { FileSystemService } from './FileSystem.service';
import { FileReaderService } from './FileReader.service';

export * from './FileSystem.service';
export * from './FileReader.service';
export * from './DomFileSystem.interface';
export * from './DirectoryEntry.interface';
export * from './FileEntry.interface';
export * from './Entry.interface';

@NgModule({
	imports: [ ],
	declarations: [
	],
	providers:[
		FileSystemService,
		FileReaderService
	],
	exports:[

	]
})
export class FileSystemModule {}

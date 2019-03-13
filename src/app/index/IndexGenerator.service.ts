import { Injectable,OnInit} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import {
	EntryExitLogger,
	Loggable,
	FileSystemService,
	FileReaderService
} from '../common/Common.module';

import {FileState,IndexState,FileService,IndexService,AddIndexesAction} from '../state/State.module';
import {DispatcherService} from '../reactive/Reactive.module';

@Loggable("app.index")
@Injectable()
export class IndexGeneratorService{

	constructor(
		private fileService:FileService,
		private indexService:IndexService,
		private dispatcherService:DispatcherService,
		private fileReaderService:FileReaderService,
		private fileSystemService:FileSystemService
	){}

	private files:Observable<File[]>;
	private indexes:Observable<IndexState[]>;

	private newIndexQueue:IndexState[] = [];

	private generatingFileIndex : BehaviorSubject<IndexState>;
	private generatingChapters:BehaviorSubject<File>;

	init(){
		this.files = this.fileService.getFiles();
		this.indexes = this.indexService.getFileIndexes();

		this.generatingFileIndex = new BehaviorSubject<IndexState>(undefined);
		this.generatingChapters = new BehaviorSubject<File>(undefined);
		this.wireIndexGenerators();

		Observable.combineLatest(this.files,this.indexes,this.fileStateChangeHandler.bind(this)).subscribe();

	}

	@EntryExitLogger
	private fileStateChangeHandler(files:File[],indexes:IndexState[]){
		if(files.length > 0 ){
			let newIndexes:IndexState[] = files.filter(this.isFileNew.bind(this,indexes))
				.map(function(file:File){
					return new IndexState(file);
				});
			if(newIndexes.length > 0){
				this.dispatcherService.dispatch(new AddIndexesAction(newIndexes));

				let doGenerate:boolean = this.newIndexQueue.length === 0;
				this.newIndexQueue = this.newIndexQueue.concat(newIndexes);
				if(doGenerate){
					this.next();
				}
			}
		}
	}

	private isFileNew(indexes:IndexState[],file:File):boolean{
		return (typeof indexes.find(this.isIndexFile.bind(this,file)) === 'undefined');
	}

	private isIndexFile(file:File,index:IndexState):boolean{
		return file === index.file;
	}

	private wireIndexGenerators(){
		this.generatingFileIndex.asObservable()
			.map(this.indexFile.bind(this))
			.subscribe();

		this.generatingChapters.asObservable()
			.map(this.readFilePart.bind(this))
			.map(this.processFilePart.bind(this))
			.do(this.addToChapter.bind(this))
			.subscribe()
	}

	private next(){
		if(typeof this.newIndexQueue !== 'undefined' && this.newIndexQueue.length > 0){
			this.generatingFileIndex.next(this.newIndexQueue.shift());
		}
	}

	@EntryExitLogger
	private createFileDir(index:IndexState):IndexState{
		return index;
	}

	private addChapter(index:IndexState):IndexState{
		return index;
	}

	@EntryExitLogger
	private indexFile(index:IndexState){

		if(index && index.file){
			this.fileReaderService.readBytes(index.file)
			.map(function(result){
				console.log("readFile result",new Uint8Array(result));
			})
			.do(this.next.bind(this))
			.subscribe();
		}


		// break the file up into parts and read them individually
		//	as each file part is read, update the indexState progress
		//
		//for each part find the new line indexes and add them to a chapter
		//
		// as each chapter gets full, create a new one.
		//
	}

	private updateProgress(index:IndexState):IndexState{
		return index;
	}

	private readFilePart(){

	}
	private processFilePart(){

	}
	private addToChapter(){

	}

	private nextFilePart(){

	}
}



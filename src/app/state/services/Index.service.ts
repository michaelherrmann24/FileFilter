import { Injectable,OnInit} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import {Store,StoreService} from '../../reactive/Reactive.module';

import {ApplicationState} from '../ApplicationState';
import {FileState} from '../FileState';
import {IndexState} from '../IndexState';

import {Chapter} from '../Chapter';

import {FileService} from './File.service';

import {EntryExitLogger,Loggable} from '../../common/Common.module';

@Loggable("app.index")
@Injectable()
export class IndexService{

	constructor(private storeService:StoreService){}

	@EntryExitLogger
	getFileIndexes():Observable<IndexState[]>{
		return this.storeService.getStore().map((state:Store)=>{
			return (<ApplicationState>state).indexes;
		}).distinctUntilChanged();
	}

	@EntryExitLogger
	getFileIndex(file:File):Observable<IndexState>{

		return this.getFileIndexes().map(function(value:IndexState[]){
			return value.find(function(indexState:IndexState){return (<File>this) === indexState.file},file);
		}).distinctUntilChanged();
	}

	// private updateState(indexState:IndexState){

	// 	// let partial:any = {};

	// 	// let currentState:IndexState = this.getCurrentState(indexState.fileName);

	// 	// if(currentState.processed !== indexState.processed){
	// 	// 	partial.processed = indexState.processed;
	// 	// }

	// 	// if(currentState.chapters){
	// 	// 	let newChapters:Chapter[] = indexState.chapters.filter(this.newChapter.bind(this,indexState.fileName));
	// 	// 	partial.chapters = currentState.chapters.concat(newChapters);
	// 	// }

	// 	// let updatedState:IndexState = this.merge(indexState.fileName,partial);
	// 	// this.data.get(indexState.fileName).next(updatedState);
	// }

	// private newChapter(fileName:string,chapter:Chapter):boolean{
	// 	let c:Chapter = this.getCurrentState(fileName).chapters.find(this.isChapter.bind(this,chapter));
	// 	return typeof c === 'undefined';
	// }

	// private isChapter(newChapter:Chapter,chapter:Chapter):boolean{
	// 	return newChapter.fileEntry.name === chapter.fileEntry.name;
	// }

	// private merge(fileName:string,newPart:any):IndexState{
	// 	let currentState:IndexState = this.getCurrentState(fileName);
	// 	return <IndexState>Object.assign(currentState, newPart);
	// }

	// private getCurrentState(fileName:string):IndexState{
	// 	// return this.data.get(fileName).getValue();
	// }

		// let obs:Observable<any>[]=[
		// 		this.fileSystem.createFile("file_name_pt1/file_name_path2/file_name.txt",20),
		// 		this.fileSystem.createFile("file_name_pt1/file_name_path3/file_name2.txt",20),
		// 		this.fileSystem.createFile("file_name3.txt",20)
		// 	];
		// Observable.zip.apply(null,obs)
		// 	.flatMap((result:any)=>{
		// 		console.log(result);
		// 		return result;
		// 	}).subscribe();



	// @EntryExitLogger
	// getIndexState(fileName:string): Observable<IndexState>{
	// 	return this.data.asObservable();
	// }

	// @EntryExitLogger
	// selectFile(file:File){
	// 	let updatedState:FileState = this.merge({selected:file})
	// 	this.fileState.next(updatedState);
	// }

	// @EntryExitLogger
	// addFiles(files:File[]){

	// 	let newFiles:File[] = files.filter(this.newFile.bind(this));
	// 	let updatedFiles:File[] = this.getCurrentState().files.concat(newFiles);

	// 	let updatedState:FileState = this.merge({files:updatedFiles});
	// 	this.fileState.next(updatedState);
	// }

	// private newFile(file:File):boolean{
	// 	let f:File = this.getCurrentState().files.find(this.isFile.bind(this,file));
	// 	return typeof f === 'undefined';
	// }

	// private isFile(newFile:File,file:File):boolean{
	// 	return newFile.name === file.name;
	// }

	//

	// private getCurrentState():FileState{
	// 	return this.fileState.getValue();
	// }
}

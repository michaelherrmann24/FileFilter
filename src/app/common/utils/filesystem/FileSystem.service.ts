import { Injectable } from '@angular/core';
import { Observable} from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

import {DomFileSystem} from './DomFileSystem.interface';
import {DirectoryEntry} from './DirectoryEntry.interface';
import {Entry} from './Entry.interface';
import {FileEntry} from './FileEntry.interface';


import {EntryExitLogger} from '../../decorators/EntryExit.decorator';
import {Loggable} from '../../decorators/Loggable.decorator';

@Loggable("app.common.utils.filesystem")
@Injectable()
export class FileSystemService{

	constructor(){}

	createFile(filePath:string,fileSize:number):Observable<FileEntry> {

		let splitPath:string[] = filePath.split(/[\/\\]/);
		let fileName:string = splitPath[splitPath.length-1];
		let dirNames:string = splitPath.filter((dir:string,index:number,arr:string[]) =>{
			return index < arr.length-1;
		}).join("\/");

		let obs:Observable<FileEntry>;
		if(dirNames){
			obs = this.createDirectory(dirNames,fileSize).flatMap((de:DirectoryEntry)=>{
				return this._getFile(de,fileName,{create:true});
			});
		}else{
			obs = this._getFileSystem(fileSize).flatMap((de:DirectoryEntry)=>{
				return this._getFile(de,fileName,{create:true});
			});
		}
		 return obs;
	}

	createDirectory(dirPath:string,fileSize:number):Observable<DirectoryEntry> {

		let splitPath:string[] = dirPath.split(/[\/\\]/);

		let obs = this._getFileSystem(fileSize);

		return splitPath.reduce( (obs:Observable<any>, dirName:string) =>{
			return obs.flatMap((de:DirectoryEntry)=>{
				return this._getDirectory(de,dirName,{create:true});
			});
		},obs);
	}

	private _getFileSystem(fileSize:number):Observable<DirectoryEntry>{
		let obs = Observable.create( (observer:Subscriber<DomFileSystem>) =>{
			(<any>window).webkitRequestFileSystem((<any>window).TEMPORARY , fileSize, observer.next.bind(observer),observer.error.bind(observer));
		}).map((fileSystem:DomFileSystem) =>{
			console.debug("return FS", fileSystem);
			return fileSystem.root;
		});
		return obs;
	}

	private _getDirectory(directoryEntry:DirectoryEntry,dirName:string,options:any):Observable<DirectoryEntry>{
		let obs = Observable.create( (observer:Subscriber<DirectoryEntry>) =>{
			directoryEntry.getDirectory(dirName,options,observer.next.bind(observer),observer.error.bind(observer));
		});
		return obs;
	}

	private _getFile(directoryEntry:DirectoryEntry,fileName:string,options:any):Observable<FileEntry>{
		let obs = Observable.create( (observer:Subscriber<Entry>) =>{
			directoryEntry.getFile(fileName,options, observer.next.bind(observer),observer.error.bind(observer));
		});
		return obs;
	}
}


// FileSystemService.prototype.getFileSystem = function(maxSize){
// 			let obs:Observable<DirectoryEntry> deferred = $q.defer();
// 			window.webkitRequestFileSystem(window.TEMPORARY , maxSize, deferred.resolve,deferred.reject);
// 			return deferred.promise;
// 		};

// 		FileSystemService.prototype.getDirectory = function(dirEntry,dirName,options){
// 			var deferred = $q.defer();
// 			dirEntry.getDirectory(dirName,options,deferred.resolve,deferred.reject);
// 			return deferred.promise;
// 		};
// 		FileSystemService.prototype.removeDirectory = function(dirEntry,dirName){
// 			var deferred = $q.defer();
// 			this.getDirectory(dirEntry,dirName,{create:false}).then(function(entry){
// 				return entry.removeRecursively(deferred.resolve,deferred.reject);
// 			},deferred.resolve);
// 			return deferred.promise;
// 		};

// 		FileSystemService.prototype.createDirectory = function(dirEntry,dirName){
// 			var deferred = $q.defer();
// 			dirEntry.getDirectory(dirName,{create:true},deferred.resolve,deferred.reject);
// 			return deferred.promise;
// 		};

// 		FileSystemService.prototype.getFile = function(dirEntry,fileName,options){
// 			var deferred = $q.defer();
// 			dirEntry.getFile(fileName,options,deferred.resolve,deferred.reject);
// 			return deferred.promise;
// 		};
// 		FileSystemService.prototype.removeFile = function(dirEntry,fileName){
// 			var deferred = $q.defer();
// 			this.getFile(dirEntry,fileName,{create:false}).then(function(fileEntry){
// 				fileEntry.remove(deferred.resolve,deferred.reject);
// 			},deferred.resolve);
// 			return deferred.promise;
// 		};
// 		FileSystemService.prototype.createFile = function(dirEntry,fileName){
// 			return this.getFile(dirEntry,fileName,{create:true});
// 		};

// 		return new FileSystemService();

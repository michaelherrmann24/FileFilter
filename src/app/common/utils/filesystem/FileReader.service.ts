import { Injectable } from '@angular/core';
import { Observable} from 'rxjs/Observable';
import { Observer} from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { Subscriber } from 'rxjs/Subscriber';

import { FileReadContext } from './FileReadContext';
import {EntryExitLogger} from '../../decorators/EntryExit.decorator';
import {Loggable} from '../../decorators/Loggable.decorator';

@Loggable("app.common.utils.filesystem")
@Injectable()
export class FileReaderService{

	fileReader:FileReader;
	queue:FileReadContext[] = [];

	private reading:boolean = false;

	constructor(){
		this.fileReader = new FileReader();
	}

	readBytes(file:File):Observable<any>{
		return this.read(file,this.fileReader.readAsArrayBuffer.bind(this.fileReader));
	}

	readText(file:File):Observable<any>{
		return this.read(file,this.fileReader.readAsText.bind(this.fileReader));
	}

	private read(file:File,fn:Function):Observable<any>{
		let frc:FileReadContext = new FileReadContext(file,this.fileReader,fn);

		this.queue.push(frc);

		let obs:Observable<any> = frc.getObservable().do(this.next.bind(this),this.error.bind(this));

		if(!this.reading){
			this.next();
		}

		return obs;
	}

	private next(){

		this.reading = true;
		let ctx:FileReadContext = this.queue.shift();
		if(typeof ctx !== 'undefined'){
			ctx.execute();
		}else{
			this.reading = false;
		}
	}

	private error(){
		this.next();
	}
}




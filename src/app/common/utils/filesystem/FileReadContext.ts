import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

export class FileReadContext{

	private subj:Subject<any>;

	private file:File;
	private reader:FileReader;
	private execFn:Function;

	constructor(file:File,reader:FileReader,execFn:Function){
		this.file = file;
		this.reader = reader;
		this.execFn = execFn;
		this.subj = new Subject();
	}

	private onLoad(){
		this.subj.next(this.reader.result);
	}

	private onError(){
		this.subj.error(this.reader.result);
	}

	execute(){
		this.reader.onload = this.onLoad.bind(this);
		this.reader.onerror = this.onError.bind(this);

		this.execFn(this.file);
	}

	getObservable():Observable<any>{
		return this.subj.asObservable();
	}
}


export class BufferedFileReader{

	private fileReader:FileReaderService;
	private file:File;

	private currentIndex:number = 0;

	private bufferSize:number = 64;

	constructor(fileReader:FileReaderService,file:File){
		this.fileReader = fileReader;
		this.file = file;
	}
	hasNext():boolean{
		return currentIndex <= file.size;
	}

	nextBytes():Observable<any>{
		return this.next(this.fileReader.reaBytes.bind(this.fileReader));
	}

	nextText(){
		return this.next(this.fileReader.readtext.bind(this.fileReader));
	}

	next(fn:Function):Observable<any>{
		let fileMax = Math.min(file.size,this.currentIndex + bufferSize);
		let filePart:File = file.slice(this.currentIndex, fileMax);

		this.currentIndex = fileMax;

		return fn(filePart);
	}
}

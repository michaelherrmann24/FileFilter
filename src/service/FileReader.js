/**
 * a queue that listens for incoming request and distributes them to workers listening for them
 */
class Queue {

    list = [];
    listeners = [];

    addDeferred(deferredObj){
        this.list.push(deferredObj);
        this.notify();
    }

    addListener(listener){
        this.listeners.push(listener);
        this.notify();
    }

    notify(){
        if(this.listeners.length > 0 && this.list.length > 0){

            let deferred = this.list.shift();
            let listener = this.listeners.shift();

            listener.execute(deferred);
            this.notify();
        }
    }    
}

/**
 * wrapper arround the promise which allows control of resolving and rejecting to a 3rd party
 */
class DeferredFileReader{
    constructor(file){
        this.file = file;
        this.promise = new Promise((resolve,reject)=>{
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}

/**
 * wrapper arround the JS FileReader which is promise based
 */
class ExtFileReader{
    constructor(queue){
        this.queue = queue;
        this.reader = new FileReader();
    }

    async execute(deferred){
        this.reader.onload = (e) => {
            deferred.resolve(e.target.result);
            this.queue.addListener(this);
        }
        this.reader.readAsText(deferred.file);
    }

}

/**
 * the actual service. which hides all the above. 
 * has a static method for singleton. (it should be) creating a lot of these creates memory leaks as chrome doesnt clean up FileReader nicely, so a limited number should be created and shared.
 */
export class FileReaderService {

    constructor(no_readers){
        this.fileQueue = new Queue();
        for(let i=0;i<no_readers;i++){
            this.fileQueue.addListener(new ExtFileReader(this.fileQueue));
        }
        
    }
    
    async readFile(file){
        let deferredFileReader = new DeferredFileReader(file);
        this.fileQueue.addDeferred(deferredFileReader);
        return deferredFileReader.promise;
    }
            
}

FileReaderService.getInstance = ()=>{
    if(!FileReaderService.instance){
        FileReaderService.instance = new FileReaderService(6);
    }
    return FileReaderService.instance;
}

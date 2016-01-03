(function(){
	"use strict";
	angular.module(APP.MODULE.FILE).factory("ChunkProcessor",['$q','$timeout','Line',ChunkProcessorService]);

	function ChunkProcessorService($q,$timeout,Line){
		/**
		 * [ChunkProcessor description]
		 */
		function ChunkProcessor(fileModel){
			var _currentIndex = 0;
			this.fileModel = fileModel;
			this.observers = []
			Object.defineProperty(this,'currentIndex',{
				get:function(){
					return _currentIndex;
				},
				set:function(value){
					_currentIndex = value
					this._triggerObserver();
				}
			});
		};

		ChunkProcessor.prototype.processChunk = function(chunk){
			console.debug()
			var deferred = $q.defer();
			var chu = chunk.properties;

			if(chu.index === 0){
				console.debug("first chunk notify",new Date());
			}

			var observer = new _Observer(chu,this,deferred);
			this.observers[chu.index] = observer;
			this._triggerObserver();

			return deferred.promise;
		};

		/**
		 * function to cause the observer to be triggered for the current index and fire its call back
		 *
		 * @return {[type]} [description]
		 */
		ChunkProcessor.prototype._triggerObserver = function(){
			var obs = this.observers[this.currentIndex];
			if(obs){
				obs.process();
			}
		};

		/**
		 * callback function for the observer. will resolve the promise and increment the current index.(which will fire the nex observer if it is existing yet.)
		 * @param  {[type]} chunk    [description]
		 * @param  {[type]} deferred [description]
		 * @return {[type]}          [description]
		 */
		ChunkProcessor.prototype._processChunk = function(chunk,deferred){
			var def = deferred;
			var partialFileMap = chunk;
			//if this is the first one
			if(this.fileModel.lines.length === 0){
				addLine(partialFileMap.firstLine,this.fileModel);
			}else if(shouldMergeLines(this.fileModel.lines[this.fileModel.lines.length-1],partialFileMap.firstLine)){
				var mergedLine = mergeLines(this.fileModel.lines.pop(),partialFileMap.firstLine);
				addLine(mergedLine,this.fileModel);
			}

			for(var i=0;i<partialFileMap.lines.length;i++){
				addLine(partialFileMap.lines[i],this.fileModel);
			}

			if(partialFileMap.lastLine){
				addLine(partialFileMap.lastLine,this.fileModel);
			}

			this.currentIndex++;
			def.resolve(this.fileModel.lines);

		};
		function addLine(line,fileModel){
			//console.debug("addLine",fileModel);

			var ln = line;
			ln.row = fileModel.lines.length+1;
			fileModel.lines.push(ln);
		};
		function shouldMergeLines(start,end){
			return !start.hasLineFeed;
		};
		//
		function mergeLines(start,end){
			return new Line(start.start,end.end,end.hasLineFeed);
		};


		function _Observer(chunk,processor,deferred){
			this.processor = processor;
			this.deferred = deferred;
			this.chunk = chunk;
		}
		_Observer.prototype.process = function(){
			//stop observing to ensure this never runs twice for a chunk.
			delete this.processor.observers[this.chunk.index];
			//process this chunk;
			this.processor._processChunk(this.chunk,this.deferred);
		};

		return ChunkProcessor
	};
})();

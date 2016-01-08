(function(){
	"use strict";
	angular.module(APP.MODULE.FILE).factory("FilterChunkPostProcessor",['$q','$timeout','Line','FiltersView',FilterChunkPostProcessorFactory]);

	function FilterChunkPostProcessorFactory($q,$timeout,Line,FiltersView){
		/**
		 * [ChunkProcessor description]
		 */
		function FilterChunkPostProcessor(filter,opt){
			var _currentIndex = 0;
			this.filter = filter;
			this.opt = opt;
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

		FilterChunkPostProcessor.prototype.processChunk = function(chunk){
			var deferred = $q.defer();
			if(chunk.index === 0){
				console.debug("first filterd chunk notify",new Date());
				this.filter.filterMap = [];
			}
			var observer = new _Observer(chunk,this,deferred);
			this.observers[chunk.index] = observer;
			this._triggerObserver();

			return deferred.promise;
		};

		/**
		 * function to cause the observer to be triggered for the current index and fire its call back
		 *
		 * @return {[type]} [description]
		 */
		FilterChunkPostProcessor.prototype._triggerObserver = function(){
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
		FilterChunkPostProcessor.prototype._processChunk = function(chunk,deferred){
			if(this.opt === this.filter.opt){
				this.filter.filterMap = this.filter.filterMap.concat(chunk.result);
				deferred.resolve(this.filter.filterMap);
			}else{
				deferred.reject("newer process running");
			}
			this.currentIndex++;
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

		return FilterChunkPostProcessor
	};
})();

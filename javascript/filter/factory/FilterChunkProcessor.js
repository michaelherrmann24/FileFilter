(function(){
	"use strict";
	angular.module(APP.MODULE.FILTER).factory("FilterChunkProcessor",['$q','fileReaderSrvc',FilterChunkProcessorFactory]);

	function FilterChunkProcessorFactory($q,fileReaderSrvc){

		/**
		 * an executable for an individual chunk which can be put into the workmanager to be threaded.
		 * [ChunkMapper description]
		 * @param {[type]} start  [description]
		 * @param {[type]} end    [description]
		 * @param {[type]} reader [description]
		 */
		function FilterChunkProcessor(start,end,file,filter){
			this.start = start;
			this.end = end;
			this.file = file;
			this.filter = filter
			this.result = [];
			this.deferred;
			this.index;

		};
		/**
		 * returns all the values requred to re-initialise this object. (required when sending this object to the web -workers)
		 * @return {[type]} [description]
		 */
		FilterChunkProcessor.prototype.serialize = function(){
			return {
				executable:"FilterChunkProcessor",
				parameters:[this.start,this.end,this.file,this.filter],
				properties:{
					index:this.index,
					result:this.result
				}
			};
		};

		FilterChunkProcessor.prototype.execute = function(){
			this.deferred = $q.defer();
			var reader = new fileReaderSrvc(this.file);
			reader.read(this.start,this.end).then(this.mapChunk.bind(this));
			return this.deferred.promise;
		};
		FilterChunkProcessor.prototype.cancel = function(){
			this.deferred.reject("CANCELLED");
		};
		FilterChunkProcessor.prototype.mapChunk = function(chunk){
			this.result = chunk.split(/[\r\n|\n]/).map(this.isVisible.bind(this));
			this.deferred.resolve(this.serialize());
		};

		FilterChunkProcessor.prototype.isVisible = function(lineTxt){
			return lineTxt.search(this.filter.value) !== -1;
		};

		return FilterChunkProcessor
	};
})();

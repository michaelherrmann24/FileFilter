(function(){
	"use strict";
	angular.module(APP.MODULE.FILE).factory("FileMapper",['$q','WorkManager','ChunkMapper','ChunkProcessor',FileMapperFactory]);

	function FileMapperFactory($q,WorkManager,ChunkMapper,ChunkProcessor){

		// 					1B 	1KB 	1MB 	10MB
		var BUFFER_SIZE = 	1 *	1024 *	1024 *	50; //10MB

		/**
		 * will create a work manager and divide up the file into chunks. once the work manager has completed then will merge all the chunk results back together.
		 * @param {[type]} file [description]
		 */
		function FileMapper(fileModel){
			this.fileModel = fileModel;
			this.file = fileModel.file;
			this.processor = new ChunkProcessor(fileModel);
		};

		FileMapper.prototype.execute = function(){
			var chunks = this.seperateIntoChunks();

			return WorkManager.execute(chunks).then(function(result){
				return result;
			});

		};
		FileMapper.prototype.seperateIntoChunks = function(){

			var chunks  = [];

			var start = 0;
			while(start<this.file.size){
				var end = Math.min(this.file.size,start + BUFFER_SIZE);
				chunks.push(new ChunkMapper(start,end,this.file));
				chunks[chunks.length-1].index = chunks.length-1;
				start = end + 1;
			}

			return chunks;
		};
		/**
		 * Notification function. gets called once each chunk has been processed. this should take each chunk merge the first/last lines where appropriate, and put all the file lines into an array in the correct order.
		 * @param  {[type]} chunk [description]
		 * @return {[type]}       [description]
		 */
		FileMapper.prototype.processChunk = function(chunk){
			return this.processor.processChunk(chunk);
		};

		return FileMapper;
	};
})();

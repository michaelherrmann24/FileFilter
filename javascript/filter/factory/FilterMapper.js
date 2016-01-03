(function(){
	"use strict";
	angular.module(APP.MODULE.FILTER).factory("FilterMapper",['$q','WorkManager',FilterMapperFactory]);

	function FilterMapperFactory($q,WorkManager){

		var ChunkLines = 1000;
		//no Readers for the workmanager to use
		var NO_READERS = 4;

		/**
		 * will create a work manager and divide up the file into chunks. once the work manager has completed then will merge all the chunk results back together.
		 * @param {[type]} file [description]
		 */
		function FilterMapper(fileModel,filter){
			this.fileModel = fileModel;
			this.filter = filter;
		};

		FileMapper.prototype.execute = function(){
			var chunks = this.seperateIntoChunks();
			var worker = new WorkManager(chunks,NO_READERS);

			return worker.start();

		};
		FileMapper.prototype.seperateIntoChunks = function(){

			var chunks  = [];

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

		/**
		 * generate all the line numbers for the file map
		 * @param  {[type]} result [description]
		 * @return {[type]}        [description]
		 */
		FileMapper.postProcess = function(fileModel){
			//console.debug(fileModel);
			// for(var i=0;i<fileModel.lines.length;i++){
			// 	fileModel.lines[i].row = i+1;
			// }
			// return $q.resolve(fileModel);
		}

		return FileMapper;
	};
})();

(function(){
	"use strict";
	angular.module(APP.MODULE.FILTER).factory("FilterMapper",['$q','WorkManager',FilterMapperFactory]);

	function FilterMapperFactory($q,WorkManager){

		var CHUNK_LINES = 1000;
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

		FilterMapper.prototype.execute = function(){
			var chunks = this.seperateIntoChunks();

			// return WorkManager.execute(chunks).then(function(result){
			// 	return result;
			// });

		};
		FilterMapper.prototype.seperateIntoChunks = function(){

			var chunks  = [];
			for(var i=0;i<this.fileModel.fileMap.length;i+=CHUNK_LINES){
				var end = Math.min(i+CHUNK_LINES,this.fileModel.fileMap.length);
				chunks.push(this.fileModel.fileMap.slice(i,end));
			}

			console.debug("chunks",chunks);

			return chunks;
		};
		/**
		 * Notification function. gets called once each chunk has been processed. this should take each chunk merge the first/last lines where appropriate, and put all the file lines into an array in the correct order.
		 * @param  {[type]} chunk [description]
		 * @return {[type]}       [description]
		 */
		FilterMapper.prototype.processChunk = function(chunk){
			//return this.processor.processChunk(chunk);
		};

		/**
		 * generate all the line numbers for the file map
		 * @param  {[type]} result [description]
		 * @return {[type]}        [description]
		 */
		FilterMapper.postProcess = function(fileModel){
			//console.debug(fileModel);
			// for(var i=0;i<fileModel.lines.length;i++){
			// 	fileModel.lines[i].row = i+1;
			// }
			// return $q.resolve(fileModel);
		}

		return FilterMapper;
	};
})();

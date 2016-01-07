(function(){
	"use strict";
	angular.module(APP.MODULE.FILTER).factory("FilterMapper",['$q','SITE','WorkManager','FilterChunkProcessor',FilterMapperFactory]);

	function FilterMapperFactory($q,SITE,WorkManager,FilterChunkProcessor){

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
			//console.debug("filter chunks",chunks);
			return WorkManager.execute(chunks).then(function(result){
				//console.debug("returned results",result);
				return result;
			});

		};
		FilterMapper.prototype.seperateIntoChunks = function(){

			var chunks  = [];

			var currentStart = 0;
			var bufferindex = SITE.FILE.BUFFER_SIZE;
			for(var i=0;i<this.fileModel.lines.length;i++){
				if(this.fileModel.lines[i].end > bufferindex ){
					//buffer size reached
					chunks.push(new FilterChunkProcessor(currentStart,this.fileModel.lines[i-1].end,this.fileModel.file,this.filter));
					chunks[chunks.length-1].index = chunks.length-1;

					currentStart = this.fileModel.lines[i].start;
					bufferindex =currentStart + SITE.FILE.BUFFER_SIZE;

				}else if(i===this.fileModel.lines.length-1){
					//last line reached
					chunks.push(new FilterChunkProcessor(currentStart,this.fileModel.lines[i].end,this.fileModel.file,this.filter));
					chunks[chunks.length-1].index = chunks.length-1;
				}
			};

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

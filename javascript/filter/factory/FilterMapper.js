(function(){
	"use strict";
	angular.module(APP.MODULE.FILTER).factory("FilterMapper",['$q','SITE','WorkManager','FilterChunkProcessor','FilterChunkPostProcessor',FilterMapperFactory]);

	function FilterMapperFactory($q,SITE,WorkManager,FilterChunkProcessor,FilterChunkPostProcessor){

		/**
		 * will create a work manager and divide up the file into chunks. once the work manager has completed then will merge all the chunk results back together.
		 * @param {[type]} file [description]
		 */
		function FilterMapper(fileModel,filter,opt){
			this.fileModel = fileModel;
			this.filter = filter;
			this.processor = new FilterChunkPostProcessor(this.filter,opt);
		};

		FilterMapper.prototype.execute = function(){
			var chunks = this.seperateIntoChunks();
			return WorkManager.execute(chunks);
		};
		FilterMapper.prototype.seperateIntoChunks = function(){

			var chunks  = [];

			var currentStart = 0;
			var bufferindex = SITE.FILE.BUFFER_SIZE;
			for(var i=0;i<this.fileModel.lines.length;i++){
				if(this.fileModel.lines[i].end > bufferindex ){
					//buffer size reached
					chunks.push(new FilterChunkProcessor(currentStart,this.fileModel.lines[i-1].end,this.fileModel.file,this.filter.value));
					chunks[chunks.length-1].index = chunks.length-1;

					currentStart = this.fileModel.lines[i].start;
					bufferindex =currentStart + SITE.FILE.BUFFER_SIZE;

				}else if(i===this.fileModel.lines.length-1){
					//last line reached
					chunks.push(new FilterChunkProcessor(currentStart,this.fileModel.lines[i].end,this.fileModel.file,this.filter.value));
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
			return this.processor.processChunk(chunk);
		};

		return FilterMapper;
	};
})();

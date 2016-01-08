(function(){
	"use strict";
	angular.module(APP.MODULE.COMMON).factory("FilterMapGenerator",['$q','FilterMapper','fileView',FilterMapGenerator]);

	function FilterMapGenerator($q,FilterMapper,fileView){

		function Generator(filter,opt){
			this.fileModel = fileView.model;
			this.filter = filter;
			this.filterMapper = new FilterMapper(this.fileModel,this.filter,opt);
			this.deferred = $q.defer();

			this.processingComplete = false;
			this.noChunksProcessed = 0;

		};
		Generator.prototype.generate = function(){
			this.filterMapper.execute().then(
				this.thenFtn.bind(this),
				this.errorFtn.bind(this),
				this.notifyFtn.bind(this)
			);
			return this.deferred.promise;
		};

		Generator.prototype.errorFtn = function(error){
			console.debug("filter Error",error);
			return this.deferred.reject(error);
		};
		/**
		 * static private function for processing the result of the file mapper.
		 * @param  {[type]} generator [description]
		 * @return {[type]}           [description]
		 */
		Generator.prototype.thenFtn = function(result){
			console.debug("filter Then",result.length,new Date());
			this.noChunks = result.length;
			this.processingComplete = true;
			this.resolveIfComplete(this.filter);
			return result
		};

		/**
		 * static private function to process the notification and propogate it when it is ready.
		 * @param  {[type]} generator [description]
		 * @return {[type]}           [description]
		 */
		Generator.prototype.notifyFtn = function(notification){
			return this.filterMapper.processChunk(notification).then(function(result){
				this.deferred.notify(result);
				this.noChunksProcessed+=1;
				this.resolveIfComplete(notification);
				return result;
			}.bind(this));
		};

		Generator.prototype.isComplete = function(){
			var isComplete = (this.processingComplete && this.noChunks === this.noChunksProcessed);
			return isComplete;
		}

		/**
		 * resolve the generation process promise if the process is complete
		 * @param  {[type]} generator [description]
		 * @return {[type]}           [description]
		 */
		Generator.prototype.resolveIfComplete = function(result){
			if(this.isComplete()){
				console.debug("generate filter map end ",new Date());
				this.deferred.resolve(result);
			}
		};

		Generator.prototype.cancel = function(){

		};

		return Generator;
	};
})();

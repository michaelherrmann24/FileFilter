(function(){
	"use strict";
	angular.module(APP.MODULE.COMMON).factory("FileMapGenerator",['$q','$timeout','FileMapper',FileMapGenerator]);

	function FileMapGenerator($q,$timeout,FileMapper){

		function Generator(file){
			this.file = file;
			this.fileMapper = new FileMapper(file);
			this.deferred = $q.defer();

			this.fileMapperExecuteComplete = false;
			this.noChunksProcessed = 0;
		}

		Generator.prototype.generate = function(){
			console.debug("generate file map start ",new Date());
			var fileMapperResults = this.fileMapper.execute().then(
					this.thenFtn.bind(this),
					this.errorFtn.bind(this),
					this.notifyFtn.bind(this)
				);

			return this.deferred.promise;

		};
		Generator.prototype.isComplete = function(){
			var isComplete = (this.fileMapperExecuteComplete && this.noChunks === this.noChunksProcessed);
			return isComplete;
		}
		/**
		 * static private function for resolving the error.
		 *
		 * @param  {[type]} generator [description]
		 * @return {[type]}           [description]
		 */
		Generator.prototype.errorFtn = function(error){
			return this.deferred.reject(error);
		};
		/**
		 * static private function for processing the result of the file mapper.
		 * @param  {[type]} generator [description]
		 * @return {[type]}           [description]
		 */
		Generator.prototype.thenFtn = function(result){
				console.debug("generateFctnThen",new Date());
				this.noChunks = result.length;
				this.fileMapperExecuteComplete = true;
				this.resolveIfComplete(this.file);
		};

		/**
		 * static private function to process the notification and propogate it when it is ready.
		 * @param  {[type]} generator [description]
		 * @return {[type]}           [description]
		 */
		Generator.prototype.notifyFtn = function(notification){
			var notify = notification;
			this.fileMapper.processChunk(notification)
			.then(function(result){
				this.deferred.notify(result);
				this.noChunksProcessed= this.noChunksProcessed + 1;
				this.resolveIfComplete(notification);
			}.bind(this));
		};

		/**
		 * resolve the generation process promise if the process is complete
		 * @param  {[type]} generator [description]
		 * @return {[type]}           [description]
		 */
		Generator.prototype.resolveIfComplete = function(result){
			if(this.isComplete()){
				console.debug("generate file map end ",new Date());
				this.deferred.resolve(result);
			}
		};

		return Generator;
	};
})();



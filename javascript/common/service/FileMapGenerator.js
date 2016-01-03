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
			var generator = this;
			console.debug("generate file map start ",new Date());
			var fileMapperResults = this.fileMapper.execute().then(
					generateFctnThen(generator),
					generateFctnError(generator),
					generateFctnNotify(generator,this.notifyPostProcessor)
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
		function generateFctnError(generator){
			var gen = generator;
			return function(error){
				console.error("file read error",error);
				return gen.deferred.reject(error);
			};

		};
		/**
		 * static private function for processing the result of the file mapper.
		 * @param  {[type]} generator [description]
		 * @return {[type]}           [description]
		 */
		function generateFctnThen(generator){
			var gen = generator;
			return function(result){
				console.debug("generateFctnThen",new Date());
				gen.noChunks = result.length;
				gen.fileMapperExecuteComplete = true;
				generateResolveIfComplete(gen,gen.file);
			};
		};

		/**
		 * static private function to process the notification and propogate it when it is ready.
		 * @param  {[type]} generator [description]
		 * @return {[type]}           [description]
		 */
		function generateFctnNotify(generator,postProcessor){
			var gen = generator;
			var pProcess = postProcessor
			return function(notification){
				//console.debug("notify",notification);
				var notify = notification;
				generator.fileMapper.processChunk(notification)
				.then(function(result){
					gen.deferred.notify(result);
					gen.noChunksProcessed= gen.noChunksProcessed + 1;
					generateResolveIfComplete(gen,notification);
				});
			};
		};

		/**
		 * resolve the generation process promise if the process is complete
		 * @param  {[type]} generator [description]
		 * @return {[type]}           [description]
		 */
		function generateResolveIfComplete(generator,result){
			var gen = generator;

			if(gen.isComplete()){
				console.debug("generate file map end ",new Date());
				gen.deferred.resolve(result);
			}
		};

		return Generator;
	};
})();



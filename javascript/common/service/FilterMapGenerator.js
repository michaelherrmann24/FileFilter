(function(){
	"use strict";
	angular.module(APP.MODULE.COMMON).factory("FilterMapGenerator",['$q','FilterMapper','fileView',FilterMapGenerator]);

	function FilterMapGenerator($q,FilterMapper,fileView){

		function Generator(filter){
			this.fileModel = fileView.model;
			this.filter = filter;

		};
		Generator.prototype.generate = function(){
			var filterMapper = new FilterMapper(this.fileModel,this.filter);
			//var chunks = filterMapper.seperateIntoChunks();

			return filterMapper.execute().then(
				this.thenFtn.bind(this),
				this.errorFtn.bind(this),
				this.notifyFtn.bind(this)
			);

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
				console.debug("filter Then",new Date());
				return result
		};

		/**
		 * static private function to process the notification and propogate it when it is ready.
		 * @param  {[type]} generator [description]
		 * @return {[type]}           [description]
		 */
		var count = 0
		Generator.prototype.notifyFtn = function(notification){
			console.debug("notify",count++);
		};

		Generator.prototype.cancel = function(){

		};

		return Generator;
	};
})();

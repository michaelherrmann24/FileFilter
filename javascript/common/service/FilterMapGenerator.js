(function(){
	"use strict";
	angular.module(APP.MODULE.COMMON).factory("FilterMapGenerator",['$q',FilterMapGenerator]);

	function FilterMapGenerator($q){

		function Generator(fileModel,filter){
			this.fileModel = fileModel;
			this.filter = filter;

			// this.filterMapper = new FilterMapper(fileModel,filter);
			// this.deferred = $q.defer();

			// this.filterMapperExecuteComplete = false;
			// this.noChunksProcessed = 0;
			// this.notifyPostProcessor = new NotifyPostProcessor();
		}


	};
})();

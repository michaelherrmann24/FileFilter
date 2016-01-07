(function(){
	"use strict";
	angular.module(APP.MODULE.WORKER).config(["SITE","WorkManagerProvider",ConfigWorkManager]);

	function ConfigWorkManager(SITE,WorkManagerProvider){
		WorkManagerProvider.setPoolSize(SITE.WORK_MANAGER.THREADS);
		//WorkManagerProvider.useWorker(true);
	};

})();

(function(){
	"use strict";
	angular.module(APP.MODULE.WORKER).run(["WorkManager",InitialiseWorkManager]);

	function InitialiseWorkManager(WorkManager){
		WorkManager.initialise();
	};

})();

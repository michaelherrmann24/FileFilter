(function(){

	APP = {
		NAME: "FileFilter",
		MODULE: {
			MAIN : "FF_MAIN",
			FILE : "FF_FILE",
			COMMON : "FF_COMMON",
			NAV : "FF_NAV",
			FILTER : "FF_FILTER",
			MENU : "FF_MENU",
			WORKER : "FF_WORKER"
		}
	};

	"use strict";

	angular.element(document).ready(function() {

		//initialise the module.
		angular.module(APP.NAME,
			[
				APP.MODULE.COMMON
				,APP.MODULE.WORKER
				,APP.MODULE.MAIN
				,APP.MODULE.NAV
				,APP.MODULE.MENU
				,APP.MODULE.FILE
				,APP.MODULE.FILTER
			]
		);

		//bootstrap the module.
		angular.bootstrap(document, [APP.NAME]);

	});
})();

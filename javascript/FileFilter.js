(function(){
	
	APP = {
		NAME: "FileFilter",
		MODULE: {
			MAIN : "FF_Main",
			FILE : "FF_File",
			COMMON : "FF_Common",
			NAV : "FF_Nav",
			NAV : "FF_Filters",
			MENU : "FF_MENU"
		}
	};
	
	"use strict";
	
	angular.element(document).ready(function() {
		
		//initialise the module.    
		angular.module(APP.NAME,[APP.MODULE.MAIN,APP.MODULE.FILE ,APP.MODULE.COMMON,APP.MODULE.NAV,APP.MODULE.MENU]);
		
		//bootstrap the module.
		angular.bootstrap(document, [APP.NAME]);
		
	});
})();
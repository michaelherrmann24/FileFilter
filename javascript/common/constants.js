(function(){
	"use strict"
	angular.module(APP.MODULE.COMMON).constant("SITE",{
		HTML : {
			BASE_DIR : "./dist/templates"
		},
		WORK_MANAGER:{
			THREADS:12
		},
		FILE:{
			// 				1B 	1KB 	1MB
			BUFFER_SIZE : 	1 *	1024 *	1024//1MB
		}
	});
})();

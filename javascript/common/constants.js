(function(){
	"use strict"
	angular.module(APP.MODULE.COMMON).constant("SITE",{
		HTML : {
			BASE_DIR : "./dist/templates"
		},
		WORK_MANAGER:{
			USE_WORKERS:true,
			THREADS:8
		},
		FILE:{
			// 				1B 	1KB 	1MB		X MB
			BUFFER_SIZE : 	1 *	1024 *	1024 *	2 // X MB
		}
	});
})();

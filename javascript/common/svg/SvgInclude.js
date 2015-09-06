(function(){
	"use strict"
	angular.module(APP.MODULE.COMMON).directive("svgInclude",[svgInclude]);
	
	function svgInclude(){
		/**
		 * The directive. 
		 */
		return {
			restrict : 'E',
			templateUrl : './dist/svg/svg-defs.comb.min.svg',
			replace:true,
			scope : {}
		};
	}

})();
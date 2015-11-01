 (function(){
	"use strict"
	angular.module(APP.MODULE.COMMON).directive("svgIcon",['$document',svgIcon]);
	
	function svgIcon($document){
		/**
		 * The SVG Icon directive will find the global icon and apply it inline. 
		 * this will make the html larger (client side only) 
		 * but will allow css to be applied to any svg elements in non global way
		 */
		return {
			restrict : 'E',
			templateUrl : './dist/templates/svgIcon.htm',
			replace:true,
			scope : {
				icon:'@',
				iconClass:'='
			},
			compile:compile
		};


		function compile(tElem, tAttrs){
			processCompile(tElem, tAttrs);
			return {
				pre:preLink,
				post:postLink	
			}
		};

		function processCompile(tElem, tAttrs){};
		function preLink(scope,iElem,iAttrs){};
		function postLink(scope,iElem,iAttrs){};
	}

})();
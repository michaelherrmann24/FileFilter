(function(){
	"use strict";
	
	angular.module(APP.MODULE.NAV).directive("first",first);
	
	function first(){
		return {
			restrict : 'A',
			require:"^^pagination",
			link: function(scope,element,attr,ctrl){
				 element.bind("click",ctrl.first);
			}
		};
	};
})();
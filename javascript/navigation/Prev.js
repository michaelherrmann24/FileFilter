(function(){
	"use strict";
	
	angular.module(APP.MODULE.NAV).directive("prev",prev);
	
	function prev(){
		return {
			restrict : 'A',
			require:"^^pagination",
			link: function(scope,element,attr,ctrl){
				 element.bind("click",ctrl.prev);
			}
		};
	};
})();
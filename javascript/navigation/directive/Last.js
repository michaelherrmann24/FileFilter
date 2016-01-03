(function(){
	"use strict";
	
	angular.module(APP.MODULE.NAV).directive("last",last);
	
	function last(){
		return {
			restrict : 'A',
			require:"^^pagination",
			link: function(scope,element,attr,ctrl){
				 element.bind("click",ctrl.last);
			}
		};
	};
})();
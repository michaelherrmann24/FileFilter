(function(){
	"use strict";
	
	angular.module(APP.MODULE.NAV).directive("next",next);
	
	function next(){
		return {
			restrict : 'A',
			require:"^^pagination",
			link: function(scope,element,attr,ctrl){
				 element.bind("click",ctrl.next);
			}
		};
	};
})();
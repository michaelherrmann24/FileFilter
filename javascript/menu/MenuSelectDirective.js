(function(){
	"use strict";
	angular.module(APP.MODULE.MENU).directive("menuSelector", ['MenuOptionFactory',MenuSelector]);
	function MenuSelector(MenuOptionFactory){
		return {
			restrict : 'A',
			compile:MenuOptionFactory.getMenuOption

		};
	};
})();

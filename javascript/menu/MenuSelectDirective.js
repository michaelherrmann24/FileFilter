(function(){
	"use strict";
	angular.module(APP.MODULE.MENU).directive("menuSelector", ['menuOptionFactory',MenuSelector]);
	function MenuSelector(menuOptionFactory){
		return {
			restrict : 'A',
			compile:menuOptionFactory.getMenuOption
			
		};
	};
})(); 

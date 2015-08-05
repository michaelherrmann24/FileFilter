(function(){
	"use strict";
	angular.module(APP.MODULE.MENU).directive("menu", [Menu]);
	function Menu(){
		return {
			restrict : 'E',
			templateUrl:"./templates/menu.htm",
			replace:true,
			scope : {},
			controller: ['$scope', '$element', '$attrs', MenuController],
			controllerAs: 'menuCtrl',
			link:function(){
				console.debug("menu directive");
			}
		};

		function MenuController($scope, $element, $attrs){

		};
	};
})(); 

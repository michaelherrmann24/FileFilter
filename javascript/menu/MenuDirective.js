(function(){
	"use strict";
	angular.module(APP.MODULE.MENU).directive("menu", ["SITE",Menu]);
	function Menu(SITE){
		return {
			restrict : 'E',
			templateUrl: SITE.HTML.BASE_DIR + '/menu.htm',
			replace:true,
			scope : {},
			controller: ['$scope', '$element', '$attrs', MenuController],
			controllerAs: 'menuCtrl',
		};

		function MenuController($scope, $element, $attrs){

		};
	};
})(); 

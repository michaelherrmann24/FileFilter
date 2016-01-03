(function(){
	"use strict";
	angular.module(APP.MODULE.NAV).factory("MenuOption",[menuOption]);

	function menuOption(){

		function MenuOption(tElement,tAttrs){
			this.compile(tElement,tAttrs);
			return {
				pre:this.preLink,
				post:this.postLink
			}
		}

		MenuOption.prototype.compile = function(tElement,tAttrs){
		};
		MenuOption.prototype.preLink = function(scope,iElement,iAttrs){
		};
		MenuOption.prototype.postLink = function(scope,iElement,iAttrs){
			scope.selected = false;
			iElement.bind('click',function(event){
				scope.selected = !scope.selected;
				scope.$applyAsync();
			});

		};

		return MenuOption;
	};
})();

(function(){
	"use strict";
	angular.module(APP.MODULE.NAV).factory("menuOption",[menuOption]);
	
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
		

		MenuOption.newInstance = function(tElement,tAttrs){ 
			return new MenuOption(tElement,tAttrs);
		};
	
		return MenuOption;
	};
})();

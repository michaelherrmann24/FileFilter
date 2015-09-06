(function(){
	"use strict";
	angular.module(APP.MODULE.NAV).factory("filterOption",['menuOption',filterOption]);
	
	function filterOption(menuOption){
		
		
		function FilterOption(tElement,tAttrs){
			return menuOption.call(this,tElement,tAttrs);
		}
		
		//use the prototype of the default msg
		FilterOption.prototype = Object.create(menuOption.prototype);
		//set the constructor back to the RetriableMsgObject 
		FilterOption.prototype.constructor = FilterOption;

		FilterOption.prototype.compile = function(tElement,tAttrs){
			menuOption.prototype.compile.apply(this,[tElement,tAttrs]);
		};
		FilterOption.prototype.preLink = function(scope,iElement,iAttrs){
			menuOption.prototype.preLink.apply(this,[scope,iElement,iAttrs]);
		};
		FilterOption.prototype.postLink = function(scope,iElement,iAttrs){
			menuOption.prototype.postLink.apply(this,[scope,iElement,iAttrs]);
			iElement.bind('click',function(event){
				console.debug("click - toggle filter visibility");
				
			});
		};
		

		FilterOption.newInstance = function(tElement,tAttrs){ 
			return new FilterOption(tElement,tAttrs);
		};
	
		return FilterOption;
	};
})();
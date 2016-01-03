(function(){
	"use strict";
	angular.module(APP.MODULE.NAV).factory("FilterOption",['MenuOption','FiltersView',FilterOptionFactory]);

	function FilterOptionFactory(MenuOption,FiltersView){


		function FilterOption(tElement,tAttrs){
			return MenuOption.call(this,tElement,tAttrs);
		}

		FilterOption.prototype = Object.create(MenuOption.prototype);
		FilterOption.prototype.constructor = FilterOption;

		FilterOption.prototype.compile = function(tElement,tAttrs){
			MenuOption.prototype.compile.apply(this,[tElement,tAttrs]);
		};
		FilterOption.prototype.preLink = function(scope,iElement,iAttrs){
			MenuOption.prototype.preLink.apply(this,[scope,iElement,iAttrs]);
		};
		FilterOption.prototype.postLink = function(scope,iElement,iAttrs){
			MenuOption.prototype.postLink.apply(this,[scope,iElement,iAttrs]);

			iElement.bind('click',function(event){
				FiltersView.toggleVisible();
			});
		};

		return FilterOption;
	};
})();

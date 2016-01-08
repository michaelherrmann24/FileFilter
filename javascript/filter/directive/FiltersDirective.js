(function(){
	"use strict";
	angular.module(APP.MODULE.FILTER).directive("ffFilters",['FiltersView',filters]);

	function filters(FiltersView){
		/**
		 * The directive.
		 */
		return {
			restrict : 'E',
			templateUrl : './templates/filters/filters.htm',
			replace:true,
			scope : {},
			link:function(scope,element,attr){
				scope.view = FiltersView;
			}
		};
	};
})();

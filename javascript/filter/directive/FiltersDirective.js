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
			controller: ['$scope','$element', '$attrs',filtersController],
			controllerAs: 'filtersCtrl',
			link:function(scope,element,attr){
				scope.view = FiltersView;
			}
		};

		function filtersController($scope,$element, $attrs){

		};
	};
})();

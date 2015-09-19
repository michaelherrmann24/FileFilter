(function(){
	"use strict";
	angular.module(APP.MODULE.FILTERS).directive("filters",['filtersView',filters]);

	function filters(filtersView){
		/**
		 * The directive. 
		 */
		return {
			restrict : 'E',
			templateUrl : './templates/filters.htm',
			replace:true,
			scope : {},
			controller: ['$scope', '$element', '$attrs',filtersController],
			controllerAs: 'filteCrtrl'
		};

		function filtersController($scope,$element, $attrs){
			this.view = filtersView;
		};
	};
})();
(function(){
	"use strict";
	angular.module(APP.MODULE.FILTERS).directive("filters",[filters]);

	function filters(){
		/**
		 * The directive. 
		 */
		return {
			restrict : 'E',
			templateUrl : './templates/filters.htm',
			replace:true,
			scope : {},
			controller: ['$scope', '$element', '$attrs',filtersController],
			controllerAs: 'filterCtrl'
		};

		function filtersController($scope,$element, $attrs){

		};
	};
})();
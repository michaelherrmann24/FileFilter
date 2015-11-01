(function(){
	"use strict";
	angular.module(APP.MODULE.FILTERS).directive("filters",['filterFactory','filtersView',filters]);

	function filters(filterFactory,filtersView){
		/**
		 * The directive. 
		 */
		return {
			restrict : 'E',
			templateUrl : './templates/filters/filters.htm',
			replace:true,
			scope : {},
			controller: ['$scope', '$element', '$attrs',filtersController],
			controllerAs: 'filtersCtrl'
		};

		function filtersController($scope,$element, $attrs){

			console.debug("filtersView",filtersView);
			console.debug("filtersView,model",filtersView.model);
			this.view = filtersView;

			this.addGroup = function(){
				
			};
			this.removeGroup = function(group){
				filtersView.removeFilter(group);
			};
			this.addFilter = function(group){
				filtersView.addFilter(group);
			};
			this.removeFilter = function(filter){
				filtersView.removeFilter(filter);
			};

		};
	};
})();

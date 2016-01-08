(function(){
	"use strict"
	angular.module(APP.MODULE.FILTER).directive("ffFilterGroup",["FiltersView",filterGroup]);


	function filterGroup(FiltersView){
		/**
		 * The directive.
		 */
		return {
			restrict : 'E',
			templateUrl : './templates/filters/filterGroup.htm',
			replace:true,
			scope : {group:'=group',filters:'=fltrs'},
			controller: ['$scope', '$element', '$attrs',filterGroupController],
			controllerAs: 'filterGroupCtrl'
		};

		function filterGroupController(scope,element, attrs){
			this.removeGroup = function(){
				scope.filters.removeGroup(scope.group);
			};
			this.addFilter = function(){
				scope.group.addFilter();
			};
		};
	};


})();

(function(){
	"use strict"
	angular.module(APP.MODULE.FILTER).directive("ffFilter",["$timeout",filter]);


	function filter($timeout){
		/**
		 * The directive.
		 */
		return {
			restrict : 'E',
			templateUrl : './templates/filters/filter.htm',
			replace:true,
			scope : {filter:'=fltr', group:'=group'},
			controller: ['$scope','$element','$attrs',filterController],
			controllerAs: 'filterCtrl'
		};

		function link(scope, element, attrs){
			//if the value of the filter goes back to whitespace only then apply async to force the digest cycle again.
			console.debug("scope filter",scope.group);
		};

		function filterController(scope,element, attrs){
			this.removeFilter = function(){
				scope.group.removeFilter(scope.filter);
			};
		};
	};


})();

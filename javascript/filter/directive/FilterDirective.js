(function(){
	"use strict"
	angular.module(APP.MODULE.FILTER).directive("ffFilter",[filter]);


	function filter(){
		/**
		 * The directive.
		 */
		return {
			restrict : 'E',
			templateUrl : './templates/filters/filter.htm',
			replace:true,
			scope : {filter:'=fltr'},
			controller: ['$scope','$element','$attrs',filterController],
			controllerAs: 'filterCtrl',
			link:link
		};

		function link(scope, element, attrs){

		};

		function filterController(scope,element, attrs){

			console.debug("filter directive link",scope.filter);
		};
	};


})();

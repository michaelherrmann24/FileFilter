(function(){
	"use strict"
	angular.module(APP.MODULE.FILTER).directive("ffFilterGroup",[filterGroup]);


	function filterGroup(ffFilterGroup){
		/**
		 * The directive.
		 */
		return {
			restrict : 'E',
			templateUrl : './templates/filters/filterGroup.htm',
			replace:true,
			scope : {group:'=group'},
			controller: ['$scope', '$element', '$attrs',filterGroupController],
			controllerAs: 'filterGroupCtrl',
			link:link
		};

		function link(scope, element, attrs){
			console.debug("filter group directive link",scope.group);
		}

		function filterGroupController(scope,element, attrs){

			// this.addFilter = function(){
			// };
			// this.removeFilter = function(){
			// };
		};
	};


})();

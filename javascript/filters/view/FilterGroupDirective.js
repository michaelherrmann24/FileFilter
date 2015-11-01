(function(){
	"use strict"
	angular.module(APP.MODULE.FILTERS).directive("filterGroup",['filterFactory',filterGroup]);


	function filterGroup(filterFactory){
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
			scope.filters = [];
			scope.filters.push(scope.group);
			var current = scope.group;
			//flatten the filter group into something usable in a template
			while(typeof(current.filter) !== 'undefined'){
				current = current.filter;
				scope.filters.push(current);
			}
		}

		function filterGroupController(scope,element, attrs){
			
			this.addFilter = function(){

				// var parent = scope.group;
				// //flatten the filter group into something usable in a template
				// while(typeof parent.filter !== 'undefined'){
				// 	parent = parent.filter;
				// }
				// console.debug("filters", scope.filters);
				// var newFilter = filterFactory.newBaseFilter(parent);				
				// scope.group.addFilter(newFilter);
				// scope.filters.push(newFilter);
			};
			this.removeGroup = function(){
			};
		};
	};


})();
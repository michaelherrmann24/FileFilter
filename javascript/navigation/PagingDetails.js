(function(){
	"use strict";
	angular.module(APP.MODULE.NAV).directive("pagingDetails",['pageView',pagingDetails]);
	function pagingDetails(pageView){
		/**
		 * The directive. 
		 */
		return {
			restrict : 'E',
			templateUrl : './templates/pagingDetails.htm',
			replace:true,
			scope : {},
			link:function($scope){
				$scope.pageView = pageView;
			}
		};
	};
})();
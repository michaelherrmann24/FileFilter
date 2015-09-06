(function(){
	"use strict";
	angular.module(APP.MODULE.NAV).directive("pagingDetails",['pageView',"SITE",pagingDetails]);
	function pagingDetails(pageView,SITE){
		/**
		 * The directive. 
		 */
		return {
			restrict : 'E',
			templateUrl : SITE.HTML.BASE_DIR + '/pagingDetails.htm',
			replace:true,
			scope : {},
			link:function($scope){
				$scope.pageView = pageView;
			}
		};
	};
})();
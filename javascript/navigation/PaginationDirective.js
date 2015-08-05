(function(){
	"use strict";
	angular.module(APP.MODULE.NAV).directive("pagination",["$log","fileView","pageView","pageFactory",pagination]);
	function pagination($log,fileView,pageView,pageFactory){
	
		
		
		/**
		 * The directive. 
		 */
		return {
			restrict : 'E',
			templateUrl : './templates/pagination.htm',
			replace:true,
			scope : {},
			controller: ['$scope', '$element', '$attrs', PaginationController],
			controllerAs: 'pagingCtrl',
		};
		
		function PaginationController($scope, $element, $attrs){

			$scope.pageView = pageView;	
			
			this.next = function(){
				$log.debug("next", $scope.currentPage, $scope.totalPages);
				
				
			};
			this.prev = function(){
				$log.debug("prev");
				
			};
			
			this.first = function(){
				$log.debug("first");
				pageView.model.currentPage = 1;
				$scope.$apply();
			};
			
			this.last = function(){
				$log.debug("last");
				pageView.model.currentPage = pageView.model.totalPages;
				$scope.$apply();
			};
			
			$scope.$watch(fileSizeWatcher,updatePage);
			
			function updatePage(calc,prevCalc){
				if(calc != prevCalc){
					pageView.model.totalLines = calc;
				}
			};
			
			/**
			 * returns an object to the watcher which contains the things we are interested in. 
			 * @returns
			 */
			function fileSizeWatcher(){
				if(angular.isDefined(fileView.model) && angular.isDefined(fileView.model.fileMap)){
					return fileView.model.fileMap.length;
				} 
				return 0;
			};
		};
	};
})();
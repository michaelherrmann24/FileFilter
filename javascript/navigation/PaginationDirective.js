(function(){
	"use strict";
	angular.module(APP.MODULE.NAV).directive("pagination",["fileView","pageView","pageFactory","SITE",pagination]);
	function pagination(fileView,pageView,pageFactory,SITE){
	
		
		
		/**
		 * The directive. 
		 */
		return {
			restrict : 'E',
			templateUrl : SITE.HTML.BASE_DIR + '/pagination.htm',
			replace:true,
			scope : {},
			controller: ['$scope', '$element', '$attrs', PaginationController],
			controllerAs: 'pagingCtrl',
		};
		
		function PaginationController($scope, $element, $attrs){

			$scope.pageView = pageView;	
			
			this.next = function(){
				if(pageView.model.currentPage < pageView.model.totalPages){
					pageView.model.currentPage++;
					$scope.$apply();
				}
			};
			this.prev = function(){
				if(pageView.model.currentPage > 1){
					pageView.model.currentPage--;
					$scope.$apply();
				}
			};
			
			this.first = function(){
				pageView.model.currentPage = 1;
				$scope.$apply();
			};
			
			this.last = function(){
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
				if(angular.isDefined(fileView.model) && angular.isDefined(fileView.model.displayMap)){
					return fileView.model.displayMap.length;
				} 
				return 0;
			};
		};
	};
})();
(function(){
	"use strict";
	angular.module(APP.MODULE.NAV).directive("pagination",["$window","fileView","pageView","SITE",pagination]);
	function pagination($window,fileView,pageView,SITE){

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
			link:link
		};

		function link($scope, $element, $attrs){
			$scope.allowScroll = $attrs.allowScroll;
			console.debug($attrs,$scope.allowScroll);
		};

		function PaginationController($scope, $element, $attrs){
			$scope.pageView = pageView;

			this.next = function(){
				if(pageView.model.currentPage < pageView.model.totalPages){
					pageView.model.currentPage++;
					$scope.$apply();
					scrolltoTop();
				}
			};
			this.prev = function(){
				if(pageView.model.currentPage > 1){
					pageView.model.currentPage--;
					$scope.$apply();
					scrolltoTop();
				}
			};

			this.first = function(){
				pageView.model.currentPage = 1;
				$scope.$apply();
				scrolltoTop();
			};

			this.last = function(){
				pageView.model.currentPage = pageView.model.totalPages;
				$scope.$apply();
				scrolltoTop();
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

			function scrolltoTop(){
				if($scope.allowScroll){
					$window.scrollTo(0,0);
				}
			};
		};
	};
})();

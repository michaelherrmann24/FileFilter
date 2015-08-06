(function(){
	"use strict";
	angular.module(APP.MODULE.NAV).directive("pagingSlider",['pageView','$log',pagingSlider]);

	function pagingSlider(pageView,$log){
		return {
			restrict : 'A',
			link: psLink
		}

		function psLink($scope, $element, $attrs){
			$scope.currentPage = 1;
			$element.bind("change",function(evt){
				pageView.model.currentPage = $scope.currentPage;
				$scope.$apply();
			});

			$element.bind("DOMMouseScroll mousewheel onmousewheel",function(evt){
				evt.preventDefault();
				if(evt.wheelDelta > 0 && $scope.currentPage > 1){
					//scroll up to got to prev page (further up the screen)
					pageView.model.currentPage = ($scope.currentPage--);
					$scope.$apply();
					
				}else if (evt.wheelDelta < 0 && $scope.currentPage < pageView.model.totalPages){
					// scroll down to go to next page  (further down the screen)
					pageView.model.currentPage = ($scope.currentPage++);
					$scope.$apply();
				}
				// pageView.model.currentPage = $scope.currentPage;
				
			});

		};
	};

})();
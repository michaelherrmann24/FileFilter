(function(){
	angular.module(APP.MODULE.FILE).directive("fileDetails",['fileView','SITE',fileDetails]);
	
	function fileDetails(fileView,SITE){
		/**
		 * The directive. 
		 */
		return {
			restrict : 'E',
			templateUrl : SITE.HTML.BASE_DIR + '/fileDetails.htm',
			replace:true,
			transclude: true,
			scope : {},
			controller: ['$scope', '$element', '$attrs', FileDetailsController],
			controllerAs: 'fileDetailsCtrl'
		};
		
		/**
		 * bind the onchange to the element.
		 */
		function FileDetailsController($scope, $element, $attrs){
			$scope.fileView = fileView;
		};
	};
})();
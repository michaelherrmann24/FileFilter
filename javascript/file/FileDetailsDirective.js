(function(){
	angular.module(APP.MODULE.FILE).directive("fileDetails",['fileView',fileDetails]);
	
	function fileDetails(fileView){
		/**
		 * The directive. 
		 */
		return {
			restrict : 'E',
			templateUrl : './templates/fileDetails.htm',
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
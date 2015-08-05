(function(){
	"use strict";
	var mainModule = angular.module(APP.MODULE.MAIN);
	
	mainModule.controller("mainController",['$scope','mainModel','$log',MainController]);
	
	/**
	 * managers the root level of the application.
	 */
	function MainController($scope,mainModel,$log){
		
		//$log.info('Initialize main controller');
		this.model = mainModel;

		$scope.countDigests = function() {
   		//	$log.info('Digest');
		}

		$scope.$watch('countDigests()');
	}	
})();
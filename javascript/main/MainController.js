(function(){
	"use strict";
	var mainModule = angular.module(APP.MODULE.MAIN);
	
	mainModule.controller("mainController",['$scope','mainModel',MainController]);
	
	/**
	 * managers the root level of the application.
	 */
	function MainController($scope,mainModel){
		
		this.model = mainModel;
	}	
})();
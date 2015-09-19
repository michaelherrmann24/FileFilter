(function(){
	"use strict";
	angular.module(APP.MODULE.FILTERS).service("filterFactory",['$q',FilterFactory]); 
	
	function FilterFactory($q){ //,fileReaderSVC

		/**
		 * constructor for a filter object
		 */
		function FilterFactory(file){

		};
		
		
		FilterFactory.getFilter = function(type){

		}
		
		return FilterFactory;

	};
})();
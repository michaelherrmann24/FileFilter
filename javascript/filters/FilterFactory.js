(function(){
	"use strict"
	angular.module(APP.MODULE.FILTERS).service("filterFactory",["baseFilter","orFilter",filterFactory]);

	function filterFactory(baseFilter,orFilter){
		var factory = {};
		
		factory.newBaseFilter = function(parent){
			return new baseFilter(parent);
		};
		// factory.newOrFilter = function(parent){

		// 	var filter = new orFilter(parent);
		// 	return filter;
		// };


		return factory;
	};
})();
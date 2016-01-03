(function(){
	"use strict";
	angular.module(APP.MODULE.FILTER).factory("Filter",[FilterFactory]);


	function FilterFactory(){

		function Filter(index){
			this.index = index;
			this.value;
			this.type;
			this.filterMap = [];
		};

		Filter.prototype.filter = function(index, linestring){

		};

		return Filter;
	}


})();

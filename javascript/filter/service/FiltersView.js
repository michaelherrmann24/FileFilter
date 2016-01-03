(function(){
	"use strict";
	angular.module(APP.MODULE.FILTER).service("FiltersView",[filtersViewService]);


	function filtersViewService(){
		this.model;
		this.visible = false;
	};
	filtersViewService.prototype.toggleVisible = function(){
		this.visible = !this.visible;
	};

})();

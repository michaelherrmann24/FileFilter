(function(){
	"use strict";
	angular.module(APP.MODULE.FILTERS).service("filtersView",['filterFactory',filtersViewService]);


	function filtersViewService(filterFactory){

		function FiltersView(){
			var model;
			this.filters; 
			var isVisible = false;
			Object.defineProperty(this,'model',{
				configurable:false,
				enumerable:false,
				get:function(){
					return model;
				},
				set:function(value){
					model = value;	
				}
			});	
			Object.defineProperty(this,'visible',{
				configurable:false,
				enumerable:false,
				get:function(){
					return isVisible;
				},
				set:function(value){
					isVisible = value;
				}	
			});

			
			return this;
		};

		FiltersView.prototype.toggleVisible = function(){
			this.visible = !this.visible;
		};

		FiltersView.prototype.addFilter = function(filter){
			
		};
		FiltersView.prototype.removeFilter = function(filter){
			//filter.removeFilter();
		};

		return new FiltersView();
	}

	
})();
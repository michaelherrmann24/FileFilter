(function(){
	"use strict";
	angular.module(APP.MODULE.FILTERS).service("filtersView",[FiltersView]);

	function FiltersView(){
		var model;
		var visible = false;
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
				return visible;
			},
			set:function(value){
				visible = value;
			}	
		});

		
		return this;
	};
	FiltersView.prototype.toggleVisible = function(){
		this.visible = !this.visible;
	};
})();
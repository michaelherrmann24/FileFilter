(function(){
	"use strict";
	angular.module(APP.MODULE.FILTER).factory("Filter",['FilterMapGenerator',FilterFactory]);


	function FilterFactory(FilterMapGenerator){

		function Filter(index){
			var pValue = "";
			var generator;
			this.index = index;
			this.type;
			this.filterMap = [];
			this.watchers = [];

			Object.defineProperty(this,'value',{
				configurable:false,
				enumerable:true,
				get:function(){
					console.debug("get filter value",pValue);
					return pValue;
				},
				set:function(val){
					console.debug("set ilter value",pValue,val);
					pValue = val;
					// debounce then run
					this._generateFilterMap();
				}
			});
		};

		Filter.prototype._generateFilterMap = function(){
			 if(typeof(this.generator) !== 'undefined' && this.generator != null) {
			 	this.generator.cancel();
			 }

			 this.generator = new FilterMapGenerator();
			 this.generator.generate();
		};

		return Filter;
	}


})();

(function(){
	"use strict";
	angular.module(APP.MODULE.FILTER).factory("Filter",['$timeout','FilterMapGenerator',FilterFactory]);


	function FilterFactory($timeout,FilterMapGenerator){

		var timeoutId = null;
		var DEBOUNCE_TIME = 500;

		function Filter(index){
			var pValue = "";
			this.generator;
			this.index = index;
			this.type;
			this.filterMap = [];

			Object.defineProperty(this,'value',{
				configurable:false,
				enumerable:true,
				get:function(){
					return pValue;
				},
				set:function(val){

					pValue = val;
					// debounce then run
					if(timeoutId){
						$timeout.cancel(timeoutId);
					}
					timeoutId = $timeout(function(){
						timeoutId = null;
						if(typeof(pValue) === 'undefined' || pValue === null || pValue.trim() === ""){
							this.filterMap = this.filterMap.map(function(){ return true;});
						}else{
							this._generateFilterMap();
						}

					}.bind(this),DEBOUNCE_TIME,false);

				}
			});
		};

		Filter.prototype._generateFilterMap = function(){
			 if(typeof(this.generator) !== 'undefined' && this.generator != null) {
			 	this.generator.cancel();
			 }

			 this.generator = new FilterMapGenerator(this);
			 this.generator.generate();
		};

		Filter.prototype.isVisible = function(idx){
			if(idx >= this.filterMap.length){
				return true;
			}

			var result = this.filterMap[idx];
			//console.debug("Filter - isVisible",result);
			return result;
		};

		return Filter;
	}


})();

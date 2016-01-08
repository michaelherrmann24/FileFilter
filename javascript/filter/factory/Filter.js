(function(){
	"use strict";
	angular.module(APP.MODULE.FILTER).factory("Filter",['$timeout','FilterMapGenerator',FilterFactory]);


	function FilterFactory($timeout,FilterMapGenerator){
		var global_filter_index = 0;
		var timeoutId = null;
		var DEBOUNCE_TIME = 500;

		function Filter(index){
			var pValue = "";
			this.generator;
			this.id = global_filter_index++;
			this.index = index;
			this.type;
			this.filterMap = [];
			this.opt = 0;
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
							console.debug("defaulting filter map");
							this.filterMap = [];
						}else{
							this.opt++;
							this._generateFilterMap(this.opt);
						}

					}.bind(this),DEBOUNCE_TIME);

				}
			});
		};

		Filter.prototype._generateFilterMap = function(opt){
			 if(typeof(this.generator) !== 'undefined' && this.generator != null) {
			 	this.generator.cancel();
			 }

			 this.generator = new FilterMapGenerator(this, opt);
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

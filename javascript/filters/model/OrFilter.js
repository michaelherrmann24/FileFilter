(function(){
	"use strict";
	angular.module(APP.MODULE.FILTERS).factory("abstractFilter",['$q','baseFilter',orFilter]); 
	

	function orFilter($q,baseFilter){

		function OrFilter(parent){
			baseFilter.call(this,[parent]);
			this.orFilterIndex = 0;
			//for the or filter the child filter is a map
			this.filter = {};
		};

		//use the prototype of the default msg
		OrFilter.prototype = Object.create(baseFilter.prototype);
		//set the constructor back to the RetriableMsgObject 
		OrFilter.prototype.constructor = OrFilter;
		
		
		OrFilter.prototype.generateFileMap = function(){

			for(var fltr in this.filter){
				
			}
		}

		OrFilter.prototype.addFilter = function(filter){
			filter.orIndex = this.orFilterIndex;
			this.filter[this.orFilterIndex] = filter;
			this.orFilterIndex++; 
			
		}
		OrFilter.prototype.removeFilter = function(filter){
			//this is ok because it is an object not an array.
			delete this.filter[filter.orIndex];
		}
		OrFilter.prototype.getFileMap = function(){
			return this.fileMap;
		}

		OrFilter.prototype.notifyParent = function(){

			//a child has changed, we need to regenerate fileMap
			this.generateFileMap();
			baseFilter.prototype.notifyParent.apply(this,[]);
		}




		return OrFilter
	}

	

})();
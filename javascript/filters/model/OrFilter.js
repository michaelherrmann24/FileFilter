(function(){
	"use strict";
	angular.module(APP.MODULE.FILTERS).factory("orFilter",['$q','baseFilter',orFilter]); 
	

	function orFilter($q,baseFilter){

		function OrFilter(parent){
			baseFilter.call(this,parent);
			this.orFilterIndex = 0;
			//for the or filter the child filter is a map
			this.filter = {};

		};

		//use the prototype of the default msg
		OrFilter.prototype = Object.create(baseFilter.prototype);
		//set the constructor back to the RetriableMsgObject 
		OrFilter.prototype.constructor = OrFilter;

		OrFilter.prototype.addFilter = function(filter){
			this.filter[filter.id] = filter;
		};
		OrFilter.prototype.removeFilter = function(filter){
			//this is ok because it is an object not an array.
			delete this.filter[filter.orIndex];
		};
		OrFilter.prototype.getFileMap = function(){
			if(this.hasFilters()){
				//console.debug("get child fileMap");
				var first = this.getFirst();
				var firstMap = this.getFirst().displayMap;
				//console.debug("OrFilter.prototype.getFileMap",first,firstMap);
				return firstMap;	
			}else{
			//	console.debug("get this fileMap" ,this.fileMap);
				return this.fileMap;
			}
			
		};

		OrFilter.prototype.run = function(line){
			//console.debug(this.id,this.value,line)

			if(this.hasFilters()){
				this.getFirst().run(line);
			}
		};


		OrFilter.prototype.notifyParent = function(){

			//a child has changed, we need to regenerate fileMap
			//this.generateFileMap();
			baseFilter.prototype.notifyParent.apply(this,[]);
		};

		OrFilter.prototype.getFirst = function(){
			for(var i in this.filter){
				return this.filter[i];
			}
		}

		OrFilter.prototype.hasFilters = function(){
			for(var i in this.filter){
				return true
			}
			return false;
		}	

		return OrFilter
	};

})();
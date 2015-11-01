(function(){
	"use strict";
	angular.module(APP.MODULE.FILTERS).service("baseFilter",['$q','$timeout','fileView',baseFilter]); 
	
	function baseFilter($q,$timeout,fileView){

		var filterId = 0;

		function BaseFilter(parent){

			var childFilter;
			var filterValue;
			var prevValue;

			this.parent = parent;
			this.fileMap = parent.fileMap;
			this.id = filterId++;

			Object.defineProperty(this,'value',{
				configurable:false,
				enumerable:false,
				get:function(){
					return filterValue;
				},
				set:function(value){
					prevValue = filterValue;
					filterValue = value;
				}
			});

			Object.defineProperty(this,'filter',{
				configurable:false,
				enumerable:false,
				get:function(){
					return childFilter;
				},
				set:function(filter){
					childFilter = filter;
				}
			});

			Object.defineProperty(this,'displayMap',{
				configurable:false,
				enumerable:false,
				get:this.getFileMap,
				set:angular.noop
			});

		};

		BaseFilter.prototype.startRun = function(){
			this.fileMap = [];
			if(this.filter){
				this.filter.startRun();
			}
		};
		BaseFilter.prototype.run = function(line,lineValue){

			if( typeof(this.value) === 'undefined' || this.value.trim() === "" || lineValue.search(this.value) !== -1){
				this.fileMap.push(line);
				if(this.filter){
					this.filter.run(line,lineValue);
				}
		
			}
			//console.debug(this.id,this.value,line)
			
		};
		BaseFilter.prototype.addFilter = function(filter){
			if(this.filter){
				this.filter.addFilter(filter);	
			}else{
				this.filter = filter;	
			}	
		}
		BaseFilter.prototype.removeFilter = function(){
			if(this.filter){
				this.parent.filter = this.filter;
			}else{
				delete this.parent.filter;
			}
		}
		BaseFilter.prototype.getFileMap = function(){
			if(this.filter){
				//console.debug("get child fileMap");
				return this.filter.displayMap;	
			}else{
				//console.debug("get this fileMap" ,this.fileMap);
				return this.fileMap;
			}
			
		};
		
		return BaseFilter
	}

})();
(function(){
	"use strict";
	angular.module(APP.MODULE.FILTERS).service("baseFilter",[baseFilter]); 
	
	function baseFilter(){

		function BaseFilter(parent){
			
			var filter;
			this.parent = parent;
			this.fileMap;

			Object.defineProperty(this,'filter',{
				configurable:false,
				enumerable:false,
				get:function(){
					return filter;
				},
				set:function(value){
					filter = value;
				}
			});
		};

		BaseFilter.prototype.addFilter = function(filter){
			this.filter = filter;
		}
		BaseFilter.prototype.removeFilter = function(filter){
			
			if(filter){
				this.filter = filter.filter;
				generateFileMap(parent.fileMap);
			}
		}
		BaseFilter.prototype.generateFileMap = function(fileMap){

			if(filter){
				filter.generateFileMap(this.fileMap);
			}
		}
		BaseFilter.prototype.getFileMap = function(){

			if(filter){
				return filter.getFileMap();
			}else{
				return this.fileMap;
			}
		}
		
		BaseFilter.prototype.notifyParent = function(){
			if(this.parent && this.parent instanceof BaseFilter){
				this.parent.notifyParent();
			}
		}

		return BaseFilter
	}

})();
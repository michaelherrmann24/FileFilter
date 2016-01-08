(function(){
	"use strict";
	angular.module(APP.MODULE.FILTER).factory("FilterGroup",['Filter',FilterGroupFactory]);


	function FilterGroupFactory(Filter){
		var global_group_index = 0;
		function FilterGroup(){
			this.id = global_group_index++;
			this.filters = [new Filter()];
		};

		/**
		 * The Filter group to add to the Array
		 * @param {[type]} filterGroup [description]
		 */
		FilterGroup.prototype.addFilter = function(){
			this.filters.push(new Filter());
		};
		/**
		 * remove the group from the groups array based on its index
		 * @param  {filterGroup} the filter group to remove from the groups array
		 * @return void
		 */
		FilterGroup.prototype.removeFilter = function(filter){
			var indexes = this.filters.map(function(item){return item.id;});
			var index = indexes.indexOf(filter.id);
			this.filters.splice(index,1);
		};

		FilterGroup.prototype.isVisible = function(idx){
			if(typeof(this.filters) === 'undefined' || this.filters.length === 0){
				return true;
			}
			//treats the filters as and.   all have to pass to remain visible.
			for(var i=0;i<this.filters.length;i++){
				if(!this.filters[i].isVisible(idx)){
					return false;
				}
			}
			return true;
		};

		return FilterGroup;
	}


})();

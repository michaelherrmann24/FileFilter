(function(){
	"use strict";
	angular.module(APP.MODULE.FILTER).factory("FilterGroup",['Filter',FilterGroupFactory]);


	function FilterGroupFactory(Filter){

		function FilterGroup(index){
			this.index = index;
			this.filters = [new Filter(0)];
		};

		/**
		 * The Filter group to add to the Array
		 * @param {[type]} filterGroup [description]
		 */
		FilterGroup.prototype.addFilter = function(){
			this.filters.push(new Filter(this.filters.length));
		};
		/**
		 * remove the group from the groups array based on its index
		 * @param  {filterGroup} the filter group to remove from the groups array
		 * @return void
		 */
		FilterGroup.prototype.removeFilter = function(filter){
			this.filters.splice(filter.index,1);
		};

		return FilterGroup;
	}


})();

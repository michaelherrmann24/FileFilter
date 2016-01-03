(function(){
	"use strict";
	angular.module(APP.MODULE.FILTER).factory("Filters",['FilterGroup',FiltersFactory]);


	function FiltersFactory(FilterGroup){

		function Filters(){
			this.groups = [new FilterGroup(0)];
		};

		/**
		 * The Filter group to add to the Array
		 * @param {[type]} filterGroup [description]
		 */
		Filters.prototype.addGroup = function(){
			this.groups.push(new FilterGroup(this.groups.length));
		};
		/**
		 * remove the group from the groups array based on its index
		 * @param  {filterGroup} the filter group to remove from the groups array
		 * @return void
		 */
		Filters.prototype.removeGroup = function(filterGroup){
			this.groups.splice(filterGroup.index,1);
		};

		return Filters;
	};


})();

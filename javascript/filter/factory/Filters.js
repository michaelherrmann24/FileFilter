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

		Filters.prototype.isVisible = function(index){

			if(typeof(this.groups) === 'undefined' || this.groups.length === 0){
				return true;
			}

			//treats each group as an or. (if 1 passes all pass. all have to fail to be not visible)
			for(var i=0;i<this.groups.length;i++){
				if(this.groups[i].isVisible(index)){
					//console.debug("Filters - isVisible",true);
					return true;
				}
			}
			//console.debug("Filters - isVisible",false);
			return false;
		};

		return Filters;
	};


})();

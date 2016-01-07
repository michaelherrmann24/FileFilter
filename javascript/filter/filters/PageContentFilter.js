(function(){
	"use strict"
	angular.module(APP.MODULE.FILTER).filter("PageContent",['FiltersView',PageContentFilter]);

	function PageContentFilter(FiltersView){

		function PageContentFilter(lineList){

			if(typeof(FiltersView.model) === 'undefined'){
				return lineList;
			}
			var filteredList = lineList.filter(filterFunction);
			//console.debug("PageContentFilter - filteredList",filteredList);
			return filteredList;

			function filterFunction(line,index){
				var isVisible = FiltersView.model.isVisible(index);
				//console.debug("PageContentFilter - isVisible",isVisible,index);
				return isVisible
			};
		};

		return PageContentFilter;

	};
})();

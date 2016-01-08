(function(){
	"use strict"
	angular.module(APP.MODULE.FILTER).filter("PageContent",['FiltersView','pageView',PageContentFilter]);

	function PageContentFilter(FiltersView,pageView){

		function PageContent(lineList){

			if(typeof(FiltersView.model) === 'undefined'){
				return lineList;
			}
			var filteredList = lineList.filter(filterFunction);

			pageView.model.totalLines = filteredList.length;

			return filteredList;

			function filterFunction(line,index){
				var isVisible = FiltersView.model.isVisible(index);
				return isVisible
			};
		};

		return PageContent;

	};
})();

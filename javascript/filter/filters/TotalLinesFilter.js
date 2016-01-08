(function(){
	"use strict"
	angular.module(APP.MODULE.FILTER).filter("VisibleLines",['fileView','FiltersView',VisibleLinesFilter]);

	function VisibleLinesFilter(fileView,FiltersView){

		function VisibleLines(totalLines){

			if(typeof(FiltersView.model) === 'undefined'){
				return lineList.length;
			}
			var count = lineList.filter(filterFunction).reduce(count);
			return filteredList;

			function filterFunction(line,index){
				var isVisible = FiltersView.model.isVisible(index);
				return isVisible
			};
		};

		return VisibleLines;

	};
})();

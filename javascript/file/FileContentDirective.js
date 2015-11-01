(function(){
	"use strict";
	angular.module(APP.MODULE.FILE).directive("fileContent",["fileView","pageView","filtersView","SITE",fileContent]);
	function fileContent(fileView,pageView,filtersView,SITE){
		return {
			restrict : 'E',
			templateUrl : SITE.HTML.BASE_DIR + '/fileContent.htm',
			replace:true,
			scope : {},
			link: function(scope,element,attr){
				scope.pageView = pageView;

				scope.displayView = fileView;
			}
		};
	};
})();
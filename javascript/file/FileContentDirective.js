(function(){
	"use strict";
	angular.module(APP.MODULE.FILE).directive("fileContent",["$log","fileView","pageView",fileContent]);
	function fileContent($log,fileView,pageView){
		return {
			restrict : 'E',
			templateUrl : './templates/fileContent.htm',
			replace:true,
			scope : {},
			link: function(scope,element,attr){
				scope.pageView = pageView;
				scope.fileView = fileView;
			}
		};
	};
})();
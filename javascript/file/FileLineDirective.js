(function(){
	"use strict";
	angular.module(APP.MODULE.FILE).directive("fileLine",["fileView","SITE",fileLine]);
	
	function fileLine(fileView,SITE){
		return {
			restrict : 'A',
			link:function(scope,element,attr){
				
				fileView.model.readLine(scope.line).then(function(result){
					scope.lineContent = result;
				});
			}
		};
	};
})();

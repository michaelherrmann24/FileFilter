(function(){
	"use strict";
	angular.module(APP.MODULE.FILE).directive("fileLine",["fileView","SITE",fileLine]);
	
	function fileLine(fileView,SITE){
		return {
			restrict : 'A',
			link:function(scope,element,attr){
				//console.debug("line",scope.line);
				fileView.model.readLine(scope.line).then(function(result){
					scope.lineContent = result;
					scope.lineNo = scope.line.lineNO;
				});
			}
		};
	};
})();

(function(){
	"use strict";
	angular.module(APP.MODULE.FILE).directive("fileLine",["$log","fileView","SITE",fileLine]);
	
	function fileLine($log,fileView,SITE){
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

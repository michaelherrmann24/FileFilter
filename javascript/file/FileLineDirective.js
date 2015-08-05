(function(){
	"use strict";
	angular.module(APP.MODULE.FILE).directive("fileLine",["$log","fileView",fileLine]);
	
	function fileLine($log,fileView){
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

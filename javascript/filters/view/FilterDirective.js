(function(){
	"use strict"
	angular.module(APP.MODULE.FILTERS).directive("groupFilter",["filterMapGenerator",filter]);


	function filter(filterMapGenerator){
		/**
		 * The directive. 
		 */
		return {
			restrict : 'E',
			templateUrl : './templates/filters/filter.htm',
			replace:true,
			scope : {filter:'=filter'},
			controller: ['$scope', '$element', '$attrs',filterController],
			controllerAs: 'filterCtrl',
			link:link
		};

		function link(scope, element, attrs){
			console.debug("link", scope.filter);
			scope.$watch(function(){return scope.filter.value;},function(newval,oldval){
				//console.debug("new old",newval,oldval);
				if(typeof(newval) !== 'undefined' && newval.trim() !== ""){
					filterMapGenerator.generate(scope.filter).then(function(result){
						console.debug("success",result,scope.filter.displayMap);					
						scope.$applyAsync();
					},function(err){
						console.debug("err",err);
					},function(notify){
						console.debug("notify",notify);
					});	
				}else{
					filterMapGenerator.cancel();
					scope.filter.fileMap = scope.filter.parent.fileMap;
				}
			});
		}

		function filterController(scope,element, attrs){
			

		};
	};


})();
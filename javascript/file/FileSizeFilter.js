(function(){
	angular.module(APP.MODULE.FILE).filter("fileSizeFilter",["$filter",fileSizeFilter]);
	
	var SIZE = ["B","KB","MB","GB","TB"];
	var INIT = 1024;
	
	function fileSizeFilter($filter){
		return function(input){
			
			if(angular.isDefined(input) && !isNaN(input) ){
				var count = 0;
				var multiplier = 1;
				while(input/multiplier > 1){
					multiplier = multiplier * INIT;
					count++;
				}
				var result = (input/(multiplier/INIT));
				return  $filter('number')(result,2) + " " + SIZE[count-1];
			}
			
			return input;
		};
	};
})();
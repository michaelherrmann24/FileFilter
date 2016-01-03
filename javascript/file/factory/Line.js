(function(){
	"use strict";
	angular.module(APP.MODULE.FILE).factory("Line",[LineFactory]);

	function LineFactory(){

		function LineModel(start,end,hasLinefeed){
			this.row;
			this.start = start;
			this.end = end;
			this.hasLineFeed = hasLinefeed;
		};

		return LineModel
	};
})();

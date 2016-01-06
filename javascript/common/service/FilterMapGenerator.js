(function(){
	"use strict";
	angular.module(APP.MODULE.COMMON).factory("FilterMapGenerator",['$q','FilterMapper',FilterMapGenerator]);

	function FilterMapGenerator($q,FilterMapper){

		function Generator(fileModel,filter){
			this.fileModel = fileModel;
			this.filter = filter;

		};
		Generator.prototype.generate = function(){
			var filterMapper = new FilterMapper(this.fileModel,this.filter);
			var chunks = filterMapper.seperateIntoChunks();

		};
		Generator.prototype.cancel = function(){

		};

		return Generator;
	};
})();

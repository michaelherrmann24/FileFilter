(function(){
	"use strict";
	angular.module(APP.MODULE.FILE).factory("FileModel",['$q','fileReaderSrvc',fileModel]);

	function fileModel($q,fileReaderSrvc){

		/**
		 * constructor for a file manager object
		 */
		function FileModel(file){
			this.file = file;
			this.fileReader = new fileReaderSrvc(file);
			this.lines = [];
		};
		FileModel.prototype.readLine = function(line){
			return this.fileReader.read(line.start, line.end);
		};

		return FileModel;
	};
})();

(function(){
	"use strict";
	angular.module(APP.MODULE.FILE).service("fileModel",['$q','fileReaderSrvc',fileModel]);
	
	function fileModel($q,fileReaderSrvc){ 


		var GENMAP_BUFFER_SIZE = 10 * 1024 * 1024; //10MB
		
		/**
		 * constructor for a file manager object
		 */
		function FileModel(file){
			this.file = file;
			this.fileReader = fileReaderSrvc.newInstance(file);
			this.fileMap = [];
		};
		

		FileModel.prototype.readLine = function(line){
			return this.fileReader.read(line.start, line.end);
		};

		
		/**
		 * statically create a new instance of the File Manager. 
		 */
		FileModel.newInstance = function(file){
			return new FileModel(file);
		};
		
		
		return FileModel;
	};
})();

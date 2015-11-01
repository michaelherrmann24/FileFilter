(function(){
	"use strict";
	angular.module(APP.MODULE.FILE).service("filteredFileModel",['$q','fileModel','fileReaderSrvc','filterFactory',filteredFileModel]);
	
	function filteredFileModel($q,fileModel,fileReaderSrvc,filterFactory){ 


		var GENMAP_BUFFER_SIZE = 10 * 1024 * 1024; //10MB
		
		/**
		 * constructor for a file manager object
		 */
		function FilteredFileModel(file){
			fileModel.call(this,file);
			this.filter = filterFactory.newBaseFilter(this);

			Object.defineProperty(this,'displayMap',{
				configurable:false,
				enumerable:false,
				get:function(){
					if(this.filter){	
						return this.filter.displayMap;
					}else{
						return this.fileMap;
					}	
				},
				set:angular.noop
			});

		};
		
		FilteredFileModel.prototype = Object.create(fileModel.prototype);
		FilteredFileModel.prototype.constructor = FilteredFileModel;

		/**
		 * method to get the file map from filemanager instance. 
		 * this will return a promise to return the map once it has been constructed. 
		 * (may take a while depending on the size of the file)
		 * @param file
		 */
		FilteredFileModel.prototype.generateFileMap = function(){
			console.debug("generating file Map",this);
			
			var currentPosition = 0;
			this.fileReader = fileReaderSrvc.newInstance(this.file);
			return nextGenMapChunk(0,this);
			console.debug("finished generating filteredFileModel map",this.fileMap);
			
		};
		
		FilteredFileModel.prototype.readLine = function(line){
			return this.fileReader.read(line.start, line.end);
		};

		/**
		 * statically create a new instance of the File Manager. 
		 */
		FilteredFileModel.newInstance = function(file){
			return new FilteredFileModel(file);
		};
		
		
		return FilteredFileModel;
	};
})();

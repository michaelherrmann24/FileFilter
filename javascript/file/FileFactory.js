(function(){
	"use strict";
	angular.module(APP.MODULE.FILE).service("fileFactory",['$q','$log','fileReaderSrvc',FileFactory]); //
	
	function FileFactory($q,$log,fileReaderSrvc){ //,fileReaderSVC

		var GENMAP_BUFFER_SIZE = 10 * 1024 * 1024; //10MB
		
		/**
		 * constructor for a file manager object
		 */
		function FileModel(file){
			this.file = file;
			this.fileReader;
			this.fileMap = [];
		};
		
		/**
		 * method to get the file map from filemanager instance. 
		 * this will return a promise to return the map once it has been constructed. 
		 * (may take a while depending on the size of the file)
		 * @param file
		 */
		FileModel.prototype.generateFileMap = function(){
			console.debug("generating file Map",this);
			
			var currentPosition = 0;
			this.fileReader = fileReaderSrvc.newInstance(this.file);
			return nextGenMapChunk(0,this);
			console.debug("finished generating map",this.fileMap);
			
		};
		
		FileModel.prototype.readLine = function(line){
			return this.fileReader.read(line.start, line.end);
		};

		function nextGenMapChunk(currentIndex,fileModel){
			if(currentIndex < fileModel.file.size){
				
				return fileModel.fileReader.read(currentIndex,(currentIndex+GENMAP_BUFFER_SIZE)).then(function(chunk){
					debugger;
					var working = chunk;
					var cp = currentIndex;

					while(working.length > 0){

						var lnBreak = working.indexOf('\n');
						//console.log("line breaks ",lnBreak,fileModel.file.size);
						if(lnBreak == -1){
							if(cp + working.length === fileModel.file.size){
								var line = {start:cp,end:fileModel.file.size};
								cp = cp + working.length + 1 ;
								fileModel.fileMap.push(line);
							}
							break ;
						}else{
							var line = {start:cp,end:cp+lnBreak};
							cp = cp + lnBreak+1;
							fileModel.fileMap.push(line);
						}
						if(working.length-1 < lnBreak+1){
							working = "";
						}else{
							working = working.substring(lnBreak+1,working.length-1);
						}

					}

					return nextGenMapChunk(cp,fileModel);

				},handleError);
				
			}else{
				$log.debug("file finished.",fileModel);
			}
			
		};
		
		function handleError(error){
			$log.error("Error Generating File Map",error);
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
(function(){
	"use strict";
	angular.module(APP.MODULE.COMMON).service("fileMapGenerator",['$q','pageView',fileMapGenerator]);

	function fileMapGenerator($q,pageView){

		var GENMAP_BUFFER_SIZE = 10 * 1024 * 1024; //10MB

		var generate = {};

		var generatorInterface = {
			generate:generateFctn
		};

		function generateFctn(file){
			//de-reference the previous promise before creating a new one.  
			
			if(typeof generate.deferred !== "undefined" ){
				cancel();
			}

			generate.deferred = $q.defer();
			generate.execute = new execute(file);

			generate.execute.run().then(success,error).finally(function(){
				generate.cancelled = false;
			});

			return generate.deferred.promise;
		};

		function execute(file){
			
			this.file = file;
			this.currentPosition = 0;
			var cancelled = false;
			this.cancel = function(){
				cancelled = true;
			};
			this.run = function(){
				return nextGenMapChunk(0,file);
			};

			function nextGenMapChunk(currentIndex,fileModel){
				if(cancelled){
					return $q.reject("cancelled");
				}
				if(currentIndex < fileModel.file.size){
					
					return fileModel.fileReader.read(currentIndex,(currentIndex+GENMAP_BUFFER_SIZE)).then(function(chunk){
						var working = chunk;
						var cp = currentIndex;

						while(working.length > 0){

							var lnBreak = working.indexOf('\n');
							//console.log("line breaks ",lnBreak,fileModel.file.size);
							if(lnBreak == -1){
								if(cp + working.length === fileModel.file.size){
									var line = new line(fileModel.fileMap.length,cp,fileModel.file.size);
									cp = cp + working.length + 1 ;
									fileModel.fileMap.push(line);
								}
								break ;
							}else{
								var line = new Line(fileModel.fileMap.length,cp,cp+lnBreak);
								cp = cp + lnBreak+1;
								fileModel.fileMap.push(line);
							}
							if(working.length-1 < lnBreak+1){
								working = "";
							}else{
								working = working.substring(lnBreak+1,working.length-1);
							}
							if(fileModel.fileMap.length === pageView.model.linesPerPage){
								notify(fileModel.fileMap.length);
							}

						}

						return nextGenMapChunk(cp,fileModel);

					},error);
					
				}else{
					console.debug("file finished.",fileModel);
					return fileModel;
				}
				
			};


		};


		function Line(row,start,end){
			this.row = row;
			this.start = start;
			this.end = end;
			return this;
		};


		function error(error){
			console.error("Error Generating File Map",error);
			generate.deferred.reject(error);
		};

		function success(result){
			generate.deferred.resolve(result);
		}
		function notify(update){
			console.debug("first-page-complete",update);
			generate.deferred.notify("first-page-complete");
		};

		function cancel(){
			generate.execute.cancel();
			generate.deferred.reject("generate-cancelled");
		};

		return generatorInterface;
	};
})();

		
(function(){
	"use strict";
	angular.module(APP.MODULE.COMMON).service("filterMapGenerator",['$q','pageView',filterMapGenerator]);

	function filterMapGenerator($q,pageView){

		var generate = {};

		var generatorInterface = {
			generate:generateFctn,
			cancel:cancel
		};

		function generateFctn(filter){

			if(typeof generate.execute !== 'undefined'){
				//cancel the previous.
				
			}


			//de-reference the previous promise before creating a new one.  
			
			if(typeof generate.deferred !== "undefined" ){
				cancel();
			}

			//if current execute is the parent 
				//start a new execute.
			//if child
				//use the current filter to start a new execute.

			generate.deferred = $q.defer();
			generate.execute = new execute(filter);

			generate.execute.run().then(success,error).finally(function(result){
				console.debug("finally result", result);
				generate.cancelled = false;
			});

			return generate.deferred.promise;

		};

		function execute(filter){

			var executeFilter = filter;
			var currentIndex = 0;
			var file = getFile(filter);
			var cancelled = false;

			var executeMap = executeFilter.fileMap;
			//if the prevValue is contained in the current value then use the filters current map to generate. else use the parent.

			if( executeFilter.value.indexOf(executeFilter.prevValue) === -1){
				executeMap = executeFilter.parent.fileMap;
			}

			this.cancel = function(){
				cancelled = true;
			};

			this.run = function(){

				function generatePart(){

					var currentlist = [];
					//console.debug("genPart",currentIndex,executeMap.length,currentlist.length,pageView.model.linesPerPage);
					while(currentIndex < executeMap.length && currentlist.length < (pageView.model.linesPerPage) &&!cancelled){
						var line = executeMap[currentIndex];
						currentIndex++;
						//console.debug("currentlList",currentlist);
						currentlist.push(new lineExecute(line));
					}
					if(currentlist.length > 0 && !cancelled){
						return $q.all(currentlist).then(processCurrentList);	
					}
					
				};

				function lineExecute(line){
					var ln = line;
					return file.readLine(ln).then(function(result){
						return {
							line:ln,
							lineValue:result
						};
					})
				};

				function processCurrentList(results){
					for(var r in results){
						executeFilter.run(results[r].line,results[r].lineValue);
					}

					if(currentIndex < executeMap.length &&!cancelled){
						notify();
						return generatePart();
					}else{
						return executeFilter.fileMap;
					}
				};

				executeFilter.startRun();
				return generatePart();
			};

			

			function getFile(fltr){
				var current = fltr;
				while(current.parent){
					current = current.parent;
				}
				return current;
			}
		};




		function error(error){
			console.error("Error Generating File Map",error);
			generate.deferred.reject(error);
		};

		function success(result){
			//console.debug("success",result);
			generate.deferred.resolve(result);
		}
		function notify(update){
			//console.debug("first-page-complete",update);
			generate.deferred.notify("page-complete");
		};

		function cancel(){
			if(generate.execute){
				generate.execute.cancel();	
			}
			if(generate.deferred){
				generate.deferred.reject("generate-cancelled");	
			}
			
		};

		return generatorInterface;
	};
})();

		
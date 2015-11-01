(function(){
	
	APP = {
		NAME: "FileFilter",
		MODULE: {
			MAIN : "FF_Main",
			FILE : "FF_File",
			COMMON : "FF_Common",
			NAV : "FF_Nav",
			FILTERS : "FF_Filters",
			MENU : "FF_MENU"
		}
	};
	
	"use strict";
	
	angular.element(document).ready(function() {
		
		//initialise the module.    
		angular.module(APP.NAME,[APP.MODULE.MAIN,APP.MODULE.FILE ,APP.MODULE.COMMON,APP.MODULE.NAV,APP.MODULE.MENU,APP.MODULE.FILTERS]);
		
		//bootstrap the module.
		angular.bootstrap(document, [APP.NAME]); 
		
	});
})(); (function(){
	"use strict";
	angular.module(APP.MODULE.COMMON,[]);
})();
 (function(){
	"use strict";
	angular.module(APP.MODULE.FILE,[]);
})(); (function(){
	"use strict"
	angular.module(APP.MODULE.FILTERS,[]);
})(); (function(){
	"use strict";
	angular.module(APP.MODULE.MAIN,[]);
})(); (function(){
	"use strict";
	angular.module(APP.MODULE.MENU,[]);
})(); (function(){
	"use strict";
	angular.module(APP.MODULE.NAV,[]);
})(); (function(){
	"use strict"
	angular.module(APP.MODULE.COMMON).constant("SITE",{
		HTML : {
			BASE_DIR : "./dist/templates"
		}
	});
})(); (function(){
	"use strict";
	angular.module(APP.MODULE.COMMON).service("fileMapGenerator",['$q','pageView',fileMapGenerator]);

	function fileMapGenerator($q,pageView){

		var GENMAP_BUFFER_SIZE = 10 * 1024 * 1024; //10MB

		var generate = {};

		var generatorInterface = {
			generate:generateFctn,
			cancel:cancel
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
			generate.execute.cancel();
			generate.deferred.reject("generate-cancelled");
		};

		return generatorInterface;
	};
})();

		  (function(){
	"use strict"
	angular.module(APP.MODULE.COMMON).directive("svgIcon",['$document',svgIcon]);
	
	function svgIcon($document){
		/**
		 * The SVG Icon directive will find the global icon and apply it inline. 
		 * this will make the html larger (client side only) 
		 * but will allow css to be applied to any svg elements in non global way
		 */
		return {
			restrict : 'E',
			templateUrl : './dist/templates/svgIcon.htm',
			replace:true,
			scope : {
				icon:'@',
				iconClass:'='
			},
			compile:compile
		};


		function compile(tElem, tAttrs){
			processCompile(tElem, tAttrs);
			return {
				pre:preLink,
				post:postLink	
			}
		};

		function processCompile(tElem, tAttrs){};
		function preLink(scope,iElem,iAttrs){};
		function postLink(scope,iElem,iAttrs){};
	}

})(); (function(){
	"use strict"
	angular.module(APP.MODULE.COMMON).directive("svgInclude",[svgInclude]);
	
	function svgInclude(){
		/**
		 * The directive. 
		 */
		return {
			restrict : 'E',
			templateUrl : './dist/svg/svg-defs.comb.min.svg',
			replace:true,
			scope : {}
		};
	}

})(); (function(){
	"use strict";
	angular.module(APP.MODULE.FILE).directive("fileContent",["fileView","pageView","filtersView","SITE",fileContent]);
	function fileContent(fileView,pageView,filtersView,SITE){
		return {
			restrict : 'E',
			templateUrl : SITE.HTML.BASE_DIR + '/fileContent.htm',
			replace:true,
			scope : {},
			link: function(scope,element,attr){
				scope.pageView = pageView;

				scope.displayView = fileView;
			}
		};
	};
})(); (function(){
	angular.module(APP.MODULE.FILE).directive("fileDetails",['fileView','SITE',fileDetails]);
	
	function fileDetails(fileView,SITE){
		/**
		 * The directive. 
		 */
		return {
			restrict : 'E',
			templateUrl : SITE.HTML.BASE_DIR + '/fileDetails.htm',
			replace:true,
			transclude: true,
			scope : {},
			controller: ['$scope', '$element', '$attrs', FileDetailsController],
			controllerAs: 'fileDetailsCtrl'
		};
		
		/**
		 * bind the onchange to the element.
		 */
		function FileDetailsController($scope, $element, $attrs){
			$scope.fileView = fileView;
		};
	};
})(); (function(){
	"use strict";
	angular.module(APP.MODULE.FILE).directive("fileLine",["fileView","SITE",fileLine]);
	
	function fileLine(fileView,SITE){
		return {
			restrict : 'A',
			link:function(scope,element,attr){
				//console.debug("line",scope.line);
				fileView.model.readLine(scope.line).then(function(result){
					scope.lineContent = result;
					scope.lineNo = scope.line.lineNO;
				});
			}
		};
	};
})();
 (function () {
	"use strict";
	angular.module(APP.MODULE.FILE).service("fileReaderSrvc",['$q',fileReaderSrvc]);
	var notified = false; 
	function fileReaderSrvc($q){
		
		/**
		 * wrapped FileReader service. 
		 */
		function FileReaderService(file){
			this.file = file;
		};
		
		/**
		 * read the specified chunk fo a file. 
		 * @param startBytes
		 * @param endBytes
		 * @returns
		 */
		FileReaderService.prototype.readBytes = function(startBytes,endBytes){
			var deferred = $q.defer();
			var reader = getReader(deferred);
			reader.readAsArrayBuffer(this.file.slice(startBytes,endBytes));
			return deferred.promise;
		};

		/**
		 * read the specified chunk fo a file. 
		 * @param startBytes
		 * @param endBytes
		 * @returns
		 */
		FileReaderService.prototype.read = function(startBytes,endBytes){
			var deferred = $q.defer();
			var reader = getReader(deferred);
			reader.readAsText(this.file.slice(startBytes,endBytes));
			return deferred.promise;
		};
		
		/**
		 * resolve the promise on file loaded successfully.
		 */
		function onLoad(reader, deferred) {
            return function () {
            	deferred.resolve(reader.result);
            };
        };
 
        /**
         * reject the promise on file read error
         */
        function onError(reader, deferred) {
            return function () {
            	deferred.reject(reader.result);
            };
        };
 
        /**
         * get a FileReader setup with onLoad and onError logic for promise based retrieval.
         */
        function getReader(deferred) {
            var reader = new FileReader(); //std javascript file reader object.
            reader.onload = onLoad(reader, deferred);
            reader.onerror = onError(reader, deferred);
            return reader;
        };
		
        /**
         * static method to return a new promise based FileReader instance. 
         * @param file
         * @returns {FileReaderService}
         */
        FileReaderService.newInstance = function(file){
			return new FileReaderService(file);
		};
		
		return FileReaderService;
	};
})(); (function(){
	"use strict";
	angular.module(APP.MODULE.FILE).directive("fileSelect",['$timeout','fileView','pageView','filtersView','filteredFileModel','pageFactory','fileMapGenerator',fileSelector]);
	
	function fileSelector($timeout,fileView,pageView,filtersView,filteredFileModel,pageFactory,fileMapGenerator){
		/**
		 * The directive. 
		 */
		return {
			restrict : 'A',
			scope : {type:'@fileSelect'},
			controller: ['$scope', '$element', '$attrs', FileSelectorController],
			controllerAs: 'fileSelectCtrl'
		};
		
		/**
		 * bind the onchange to the element.
		 */
		function FileSelectorController($scope, $element, $attrs){
			//$element.bind('change',initFileManager);
			$element.bind('dragover',handleDragOver);
			$element.bind('drop',handleDrop);	

			/**
			  * grab the file from the input and initiate the file Manager.
			  * set the file manager onto the mainManager for global use. 
			  */
			function handleDragOver(evt){
			    evt.stopPropagation();
			    evt.preventDefault();
				//show the event as a copy.
			    evt.dataTransfer.dropEffect = 'copy';
				
			};
			
			 /**
			  * grab the file from the input and initiate the file Manager.
			  * set the file manager onto the mainManager for global use. 
			  */
			function handleDrop(evt){
				evt.stopPropagation();
			    evt.preventDefault();
			    
				fileView.model = filteredFileModel.newInstance(evt.dataTransfer.files[0]);
				pageView.model = pageFactory.newInstance();
				filtersView.model = fileView.model.filter;

				console.debug("filtersView.model",filtersView.model);

				fileMapGenerator.generate(fileView.model).then(function(result){
					console.debug("file map completed",result);
					fileView.model = result;
				},function(err){
					console.debug("error",err);
				},function(update){
					console.debug("notify update",update);
				}).finally(function(){
					$scope.$applyAsync();
				});
				//fileView.model.generateFileMap();
				
				
			};

			
		};
	};
	
})();
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
})(); (function(){
	"use strict";
	angular.module(APP.MODULE.FILE).service("fileView",[FileView]);

	function FileView(){
		var model;
		Object.defineProperty(this,'model',{
			configurable:false,
			enumerable:false,
			get:function(){
				return model;
			},
			set:function(value){
				model = value;
			}
		});	
	};
})(); (function(){
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
 (function(){
	"use strict"
	angular.module(APP.MODULE.FILTERS).service("filterFactory",["baseFilter","orFilter",filterFactory]);

	function filterFactory(baseFilter,orFilter){
		var factory = {};
		
		factory.newBaseFilter = function(parent){
			return new baseFilter(parent);
		};
		// factory.newOrFilter = function(parent){

		// 	var filter = new orFilter(parent);
		// 	return filter;
		// };


		return factory;
	};
})(); (function(){
	"use strict";
	angular.module(APP.MODULE.FILTERS).service("baseFilter",['$q','$timeout','fileView',baseFilter]); 
	
	function baseFilter($q,$timeout,fileView){

		var filterId = 0;

		function BaseFilter(parent){

			var childFilter;
			var filterValue;
			var prevValue;

			this.parent = parent;
			this.fileMap = parent.fileMap;
			this.id = filterId++;

			Object.defineProperty(this,'value',{
				configurable:false,
				enumerable:false,
				get:function(){
					return filterValue;
				},
				set:function(value){
					prevValue = filterValue;
					filterValue = value;
				}
			});

			Object.defineProperty(this,'filter',{
				configurable:false,
				enumerable:false,
				get:function(){
					return childFilter;
				},
				set:function(filter){
					childFilter = filter;
				}
			});

			Object.defineProperty(this,'displayMap',{
				configurable:false,
				enumerable:false,
				get:this.getFileMap,
				set:angular.noop
			});

		};

		BaseFilter.prototype.startRun = function(){
			this.fileMap = [];
			if(this.filter){
				this.filter.startRun();
			}
		};
		BaseFilter.prototype.run = function(line,lineValue){

			if( typeof(this.value) === 'undefined' || this.value.trim() === "" || lineValue.search(this.value) !== -1){
				this.fileMap.push(line);
				if(this.filter){
					this.filter.run(line,lineValue);
				}
		
			}
			//console.debug(this.id,this.value,line)
			
		};
		BaseFilter.prototype.addFilter = function(filter){
			if(this.filter){
				this.filter.addFilter(filter);	
			}else{
				this.filter = filter;	
			}	
		}
		BaseFilter.prototype.removeFilter = function(){
			if(this.filter){
				this.parent.filter = this.filter;
			}else{
				delete this.parent.filter;
			}
		}
		BaseFilter.prototype.getFileMap = function(){
			if(this.filter){
				//console.debug("get child fileMap");
				return this.filter.displayMap;	
			}else{
				//console.debug("get this fileMap" ,this.fileMap);
				return this.fileMap;
			}
			
		};
		
		return BaseFilter
	}

})(); (function(){
	"use strict";
	angular.module(APP.MODULE.FILTERS).factory("orFilter",['$q','baseFilter',orFilter]); 
	

	function orFilter($q,baseFilter){

		function OrFilter(parent){
			baseFilter.call(this,parent);
			this.orFilterIndex = 0;
			//for the or filter the child filter is a map
			this.filter = {};

		};

		//use the prototype of the default msg
		OrFilter.prototype = Object.create(baseFilter.prototype);
		//set the constructor back to the RetriableMsgObject 
		OrFilter.prototype.constructor = OrFilter;

		OrFilter.prototype.addFilter = function(filter){
			this.filter[filter.id] = filter;
		};
		OrFilter.prototype.removeFilter = function(filter){
			//this is ok because it is an object not an array.
			delete this.filter[filter.orIndex];
		};
		OrFilter.prototype.getFileMap = function(){
			if(this.hasFilters()){
				//console.debug("get child fileMap");
				var first = this.getFirst();
				var firstMap = this.getFirst().displayMap;
				//console.debug("OrFilter.prototype.getFileMap",first,firstMap);
				return firstMap;	
			}else{
			//	console.debug("get this fileMap" ,this.fileMap);
				return this.fileMap;
			}
			
		};

		OrFilter.prototype.run = function(line){
			//console.debug(this.id,this.value,line)

			if(this.hasFilters()){
				this.getFirst().run(line);
			}
		};


		OrFilter.prototype.notifyParent = function(){

			//a child has changed, we need to regenerate fileMap
			//this.generateFileMap();
			baseFilter.prototype.notifyParent.apply(this,[]);
		};

		OrFilter.prototype.getFirst = function(){
			for(var i in this.filter){
				return this.filter[i];
			}
		}

		OrFilter.prototype.hasFilters = function(){
			for(var i in this.filter){
				return true
			}
			return false;
		}	

		return OrFilter
	};

})(); (function(){
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


})(); (function(){
	"use strict"
	angular.module(APP.MODULE.FILTERS).directive("filterGroup",['filterFactory',filterGroup]);


	function filterGroup(filterFactory){
		/**
		 * The directive. 
		 */
		return {
			restrict : 'E',
			templateUrl : './templates/filters/filterGroup.htm',
			replace:true,
			scope : {group:'=group'},
			controller: ['$scope', '$element', '$attrs',filterGroupController],
			controllerAs: 'filterGroupCtrl',
			link:link
		};

		function link(scope, element, attrs){
			scope.filters = [];
			scope.filters.push(scope.group);
			var current = scope.group;
			//flatten the filter group into something usable in a template
			while(typeof(current.filter) !== 'undefined'){
				current = current.filter;
				scope.filters.push(current);
			}
		}

		function filterGroupController(scope,element, attrs){
			
			this.addFilter = function(){

				// var parent = scope.group;
				// //flatten the filter group into something usable in a template
				// while(typeof parent.filter !== 'undefined'){
				// 	parent = parent.filter;
				// }
				// console.debug("filters", scope.filters);
				// var newFilter = filterFactory.newBaseFilter(parent);				
				// scope.group.addFilter(newFilter);
				// scope.filters.push(newFilter);
			};
			this.removeGroup = function(){
			};
		};
	};


})(); (function(){
	"use strict";
	angular.module(APP.MODULE.FILTERS).directive("filters",['filterFactory','filtersView',filters]);

	function filters(filterFactory,filtersView){
		/**
		 * The directive. 
		 */
		return {
			restrict : 'E',
			templateUrl : './templates/filters/filters.htm',
			replace:true,
			scope : {},
			controller: ['$scope', '$element', '$attrs',filtersController],
			controllerAs: 'filtersCtrl'
		};

		function filtersController($scope,$element, $attrs){

			console.debug("filtersView",filtersView);
			console.debug("filtersView,model",filtersView.model);
			this.view = filtersView;

			this.addGroup = function(){
				
			};
			this.removeGroup = function(group){
				filtersView.removeFilter(group);
			};
			this.addFilter = function(group){
				filtersView.addFilter(group);
			};
			this.removeFilter = function(filter){
				filtersView.removeFilter(filter);
			};

		};
	};
})();
 (function(){
	"use strict";
	angular.module(APP.MODULE.FILTERS).service("filtersView",['filterFactory',filtersViewService]);


	function filtersViewService(filterFactory){

		function FiltersView(){
			var model;
			this.filters; 
			var isVisible = false;
			Object.defineProperty(this,'model',{
				configurable:false,
				enumerable:false,
				get:function(){
					return model;
				},
				set:function(value){
					model = value;	
				}
			});	
			Object.defineProperty(this,'visible',{
				configurable:false,
				enumerable:false,
				get:function(){
					return isVisible;
				},
				set:function(value){
					isVisible = value;
				}	
			});

			
			return this;
		};

		FiltersView.prototype.toggleVisible = function(){
			this.visible = !this.visible;
		};

		FiltersView.prototype.addFilter = function(filter){
			
		};
		FiltersView.prototype.removeFilter = function(filter){
			//filter.removeFilter();
		};

		return new FiltersView();
	}

	
})(); (function(){
	"use strict";
	var mainModule = angular.module(APP.MODULE.MAIN);
	
	mainModule.controller("mainController",['$scope','mainModel',MainController]);
	
	/**
	 * managers the root level of the application.
	 */
	function MainController($scope,mainModel){
		
		this.model = mainModel;
	}	
})(); (function(){
	"use strict"
	//this is a service because there should only ever be 1 instance. 
	angular.module(APP.MODULE.MAIN).service("mainModel",[mainModel]);
	
	function mainModel(){
	
		function MainModel(){
			this.fileModel;
			this.filterModel;
			this.pageModel;
		};
		
		MainModel.prototype.setFileModel = function(fileModel){
			this.fileModel = fileModel;
		};
		
		MainModel.prototype.setFilterModel = function(filterModel){
			this.filteredFileModel = fileModel;
		}
		
		MainModel.prototype.setPageModel = function(pageModel){
			this.pageModel = pageModel;
		};

		MainModel.prototype.getFileModel = function(){
			return this.fileModel;
		};
		
		return new MainModel();
	};
})(); (function(){
	"use strict";
	angular.module(APP.MODULE.MENU).directive("menu", ["SITE",Menu]);
	function Menu(SITE){
		return {
			restrict : 'E',
			templateUrl: SITE.HTML.BASE_DIR + '/menu.htm',
			replace:true,
			scope : {},
			controller: ['$scope', '$element', '$attrs', MenuController],
			controllerAs: 'menuCtrl',
		};

		function MenuController($scope, $element, $attrs){

		};
	};
})(); 
 (function(){
	"use strict";
	angular.module(APP.MODULE.MENU).service("menuOptionFactory", ['menuOption','filterOption',menuOptionFactory]);
	
	function menuOptionFactory(menuOption,filterOption){
		
		function MenuOptionFactory(){}

		/*
		* factory function to return the compile funtion to use for the menu selector. 
		*
		*/
		MenuOptionFactory.getMenuOption = function(tElement,tAttrs){
			var rtn;
			switch(tAttrs.menuSelector) {
    			case "filter":
        			rtn = filterOption.newInstance(tElement,tAttrs);
       	 			break;
    			default:
        			rtn = menuOption.newInstance(tElement,tAttrs);
			}
			return rtn;

		}
		return MenuOptionFactory;
	};
})(); 
 (function(){
	"use strict";
	angular.module(APP.MODULE.NAV).factory("filterOption",['menuOption','filtersView','orFilter','baseFilter','fileView',filterOption]);
	
	function filterOption(menuOption,filtersView,orFilter,baseFilter,fileView){
		
		
		function FilterOption(tElement,tAttrs){
			return menuOption.call(this,tElement,tAttrs);
		}
		
		//use the prototype of the default msg
		FilterOption.prototype = Object.create(menuOption.prototype);
		//set the constructor back to the RetriableMsgObject 
		FilterOption.prototype.constructor = FilterOption;

		FilterOption.prototype.compile = function(tElement,tAttrs){
			menuOption.prototype.compile.apply(this,[tElement,tAttrs]);
		};
		FilterOption.prototype.preLink = function(scope,iElement,iAttrs){
			menuOption.prototype.preLink.apply(this,[scope,iElement,iAttrs]);
		};
		FilterOption.prototype.postLink = function(scope,iElement,iAttrs){
			menuOption.prototype.postLink.apply(this,[scope,iElement,iAttrs]);

			iElement.bind('click',function(event){
				filtersView.toggleVisible();
			});
		};
		

		FilterOption.newInstance = function(tElement,tAttrs){ 
			return new FilterOption(tElement,tAttrs);
		};
	
		return FilterOption;
	};
})(); (function(){
	"use strict";
	angular.module(APP.MODULE.NAV).factory("menuOption",[menuOption]);
	
	function menuOption(){

		function MenuOption(tElement,tAttrs){
			this.compile(tElement,tAttrs);
			return {
				pre:this.preLink,
				post:this.postLink
			}
		}
		
		MenuOption.prototype.compile = function(tElement,tAttrs){
		};
		MenuOption.prototype.preLink = function(scope,iElement,iAttrs){
		};
		MenuOption.prototype.postLink = function(scope,iElement,iAttrs){
			scope.selected = false;
			iElement.bind('click',function(event){
				scope.selected = !scope.selected;
				scope.$applyAsync();
			});
			
		};
		

		MenuOption.newInstance = function(tElement,tAttrs){ 
			return new MenuOption(tElement,tAttrs);
		};
	
		return MenuOption;
	};
})();
 (function(){
	"use strict";
	angular.module(APP.MODULE.MENU).directive("menuSelector", ['menuOptionFactory',MenuSelector]);
	function MenuSelector(menuOptionFactory){
		return {
			restrict : 'A',
			compile:menuOptionFactory.getMenuOption
			
		};
	};
})(); 
 (function(){
	"use strict";
	
	angular.module(APP.MODULE.NAV).directive("first",first);
	
	function first(){
		return {
			restrict : 'A',
			require:"^^pagination",
			link: function(scope,element,attr,ctrl){
				 element.bind("click",ctrl.first);
			}
		};
	};
})(); (function(){
	"use strict";
	
	angular.module(APP.MODULE.NAV).directive("last",last);
	
	function last(){
		return {
			restrict : 'A',
			require:"^^pagination",
			link: function(scope,element,attr,ctrl){
				 element.bind("click",ctrl.last);
			}
		};
	};
})(); (function(){
	"use strict";
	
	angular.module(APP.MODULE.NAV).directive("next",next);
	
	function next(){
		return {
			restrict : 'A',
			require:"^^pagination",
			link: function(scope,element,attr,ctrl){
				 element.bind("click",ctrl.next);
			}
		};
	};
})(); (function(){
	"use strict";
	angular.module(APP.MODULE.NAV).factory("pageFactory",[pageFactory]);
	
	function pageFactory(){
		
		var DEFAULT_LINES_PER_PAGE = 200;
		var MIN_PAGE = 1;

		var currentPage = 1;
		var totalPages = MIN_PAGE;
		var totalLines = 0;
		var linesPerPage = DEFAULT_LINES_PER_PAGE;
		/**
		 * Page Manager Constructor.
		 */
		function PageModel(){
			Object.defineProperty(this,"currentPage",{
				configurable:false,
				enumerable:false,
				get:function(){
					return currentPage;
				},
				set:function(value){
					currentPage = value;	
				}
			});

			Object.defineProperty(this,"linesPerPage",{
				configurable:false,
				enumerable:false,
				get:function(){
					return linesPerPage;
				},
				set:function(value){
					linesPerPage = value;
					currentPage = 1;
					totalPages = calcPages();
				}
			});

			Object.defineProperty(this,"totalLines",{
				configurable:false,
				enumerable:false,
				get:function(){
					return totalLines;
				},
				set:function(value){

					totalLines = value;
					totalPages = calcPages();
				}
			});

			Object.defineProperty(this,"totalPages",{
				configurable:false,
				enumerable:false,
				get:function(){
					return totalPages;
				}
			});
		};
		
		function calcPages(){
			if(!isNaN(linesPerPage) && !isNaN(totalLines)) {
				var pageSize = Math.max(linesPerPage,1);
				var pages = Math.ceil(totalLines/pageSize);
				return Math.max(pages,1);
			}
			return 1;
		};

		PageModel.newInstance = function(){ 
			return new PageModel();
		};
	
		return PageModel;
	};
})();
 (function(){
	"use strict";
	angular.module(APP.MODULE.NAV).service("pageView",[pageView]);

	function pageView(){
		var model;
		Object.defineProperty(this,'model',{
			configurable:false,
			enumerable:false,
			get:function(){
				return model;
			},
			set:function(value){
				model = value;
			}
		});	
	};
})(); (function(){
	"use strict";
	angular.module(APP.MODULE.NAV).directive("pagination",["fileView","pageView","pageFactory","SITE",pagination]);
	function pagination(fileView,pageView,pageFactory,SITE){
	
		
		
		/**
		 * The directive. 
		 */
		return {
			restrict : 'E',
			templateUrl : SITE.HTML.BASE_DIR + '/pagination.htm',
			replace:true,
			scope : {},
			controller: ['$scope', '$element', '$attrs', PaginationController],
			controllerAs: 'pagingCtrl',
		};
		
		function PaginationController($scope, $element, $attrs){

			$scope.pageView = pageView;	
			
			this.next = function(){
				if(pageView.model.currentPage < pageView.model.totalPages){
					pageView.model.currentPage++;
					$scope.$apply();
				}
			};
			this.prev = function(){
				if(pageView.model.currentPage > 1){
					pageView.model.currentPage--;
					$scope.$apply();
				}
			};
			
			this.first = function(){
				pageView.model.currentPage = 1;
				$scope.$apply();
			};
			
			this.last = function(){
				pageView.model.currentPage = pageView.model.totalPages;
				$scope.$apply();
			};
			
			$scope.$watch(fileSizeWatcher,updatePage);

			function updatePage(calc,prevCalc){
				if(calc != prevCalc){
					pageView.model.totalLines = calc;
				}
			};
			
			/**
			 * returns an object to the watcher which contains the things we are interested in. 
			 * @returns
			 */
			function fileSizeWatcher(){
				if(angular.isDefined(fileView.model) && angular.isDefined(fileView.model.displayMap)){
					return fileView.model.displayMap.length;
				} 
				return 0;
			};
		};
	};
})(); (function(){
	"use strict";
	angular.module(APP.MODULE.NAV).directive("pagingDetails",['pageView',"SITE",pagingDetails]);
	function pagingDetails(pageView,SITE){
		/**
		 * The directive. 
		 */
		return {
			restrict : 'E',
			templateUrl : SITE.HTML.BASE_DIR + '/pagingDetails.htm',
			replace:true,
			scope : {},
			link:function($scope){
				$scope.pageView = pageView;
			}
		};
	};
})(); (function(){
	"use strict";
	
	angular.module(APP.MODULE.NAV).directive("prev",prev);
	
	function prev(){
		return {
			restrict : 'A',
			require:"^^pagination",
			link: function(scope,element,attr,ctrl){
				 element.bind("click",ctrl.prev);
			}
		};
	};
})();
//# sourceMappingURL=FileFilter.comb.js.map
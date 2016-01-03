(function(){

	APP = {
		NAME: "FileFilter",
		MODULE: {
			MAIN : "FF_MAIN",
			FILE : "FF_FILE",
			COMMON : "FF_COMMON",
			NAV : "FF_NAV",
			FILTER : "FF_FILTER",
			MENU : "FF_MENU",
			WORKER : "FF_WORKER"
		}
	};

	"use strict";

	angular.element(document).ready(function() {

		//initialise the module.
		angular.module(APP.NAME,
			[
				APP.MODULE.COMMON
				,APP.MODULE.WORKER
				,APP.MODULE.MAIN
				,APP.MODULE.NAV
				,APP.MODULE.MENU
				,APP.MODULE.FILE
				,APP.MODULE.FILTER
			]
		);

		//bootstrap the module.
		angular.bootstrap(document, [APP.NAME]);

	});
})();
 (function(){
	"use strict";
	angular.module(APP.MODULE.COMMON,[]);
})();
 (function(){
	"use strict";
	angular.module(APP.MODULE.FILE,[]);
})(); (function(){
	"use strict"
	angular.module(APP.MODULE.FILTER,[]);
})();
 (function(){
	"use strict";
	angular.module(APP.MODULE.MAIN,[]);
})(); (function(){
	"use strict";
	angular.module(APP.MODULE.MENU,[]);
})(); (function(){
	"use strict";
	angular.module(APP.MODULE.NAV,[]);
})(); (function(){
	"use strict";
	angular.module(APP.MODULE.WORKER,[]);
})();
 (function(){
	"use strict"
	angular.module(APP.MODULE.COMMON).constant("SITE",{
		HTML : {
			BASE_DIR : "./dist/templates"
		},
		WORK_MANAGER:{
			THREADS:12
		}
	});
})();
 (function(){
	"use strict";
	angular.module(APP.MODULE.COMMON).factory("FileMapGenerator",['$q','$timeout','FileMapper',FileMapGenerator]);

	function FileMapGenerator($q,$timeout,FileMapper){

		function Generator(file){
			this.file = file;
			this.fileMapper = new FileMapper(file);
			this.deferred = $q.defer();

			this.fileMapperExecuteComplete = false;
			this.noChunksProcessed = 0;
		}

		Generator.prototype.generate = function(){
			var generator = this;
			console.debug("generate file map start ",new Date());
			var fileMapperResults = this.fileMapper.execute().then(
					generateFctnThen(generator),
					generateFctnError(generator),
					generateFctnNotify(generator,this.notifyPostProcessor)
				);

			return this.deferred.promise;

		};
		Generator.prototype.isComplete = function(){
			var isComplete = (this.fileMapperExecuteComplete && this.noChunks === this.noChunksProcessed);
			return isComplete;
		}
		/**
		 * static private function for resolving the error.
		 *
		 * @param  {[type]} generator [description]
		 * @return {[type]}           [description]
		 */
		function generateFctnError(generator){
			var gen = generator;
			return function(error){
				console.error("file read error",error);
				return gen.deferred.reject(error);
			};

		};
		/**
		 * static private function for processing the result of the file mapper.
		 * @param  {[type]} generator [description]
		 * @return {[type]}           [description]
		 */
		function generateFctnThen(generator){
			var gen = generator;
			return function(result){
				console.debug("generateFctnThen",new Date());
				gen.noChunks = result.length;
				gen.fileMapperExecuteComplete = true;
				generateResolveIfComplete(gen,gen.file);
			};
		};

		/**
		 * static private function to process the notification and propogate it when it is ready.
		 * @param  {[type]} generator [description]
		 * @return {[type]}           [description]
		 */
		function generateFctnNotify(generator,postProcessor){
			var gen = generator;
			var pProcess = postProcessor
			return function(notification){
				//console.debug("notify",notification);
				var notify = notification;
				generator.fileMapper.processChunk(notification)
				.then(function(result){
					gen.deferred.notify(result);
					gen.noChunksProcessed= gen.noChunksProcessed + 1;
					generateResolveIfComplete(gen,notification);
				});
			};
		};

		/**
		 * resolve the generation process promise if the process is complete
		 * @param  {[type]} generator [description]
		 * @return {[type]}           [description]
		 */
		function generateResolveIfComplete(generator,result){
			var gen = generator;

			if(gen.isComplete()){
				console.debug("generate file map end ",new Date());
				gen.deferred.resolve(result);
			}
		};

		return Generator;
	};
})();


 (function(){
	"use strict";
	angular.module(APP.MODULE.COMMON).factory("FilterMapGenerator",['$q',FilterMapGenerator]);

	function FilterMapGenerator($q){

		function Generator(fileModel,filter){
			this.fileModel = fileModel;
			this.filter = filter;

			// this.filterMapper = new FilterMapper(fileModel,filter);
			// this.deferred = $q.defer();

			// this.filterMapperExecuteComplete = false;
			// this.noChunksProcessed = 0;
			// this.notifyPostProcessor = new NotifyPostProcessor();
		}


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
			};
		};

		function processCompile(tElem, tAttrs){};
		function preLink(scope,iElem,iAttrs){};
		function postLink(scope,iElem,iAttrs){};
	}

})();
 (function(){
	"use strict"
	angular.module(APP.MODULE.COMMON).directive("svgInclude",[svgInclude]);
	
	function svgInclude(){
		/**
		 * The directive. 
		 */
		return {
			restrict : 'E',
			templateUrl : './dist/svg/svg-defs.comb.svg',
			replace:true,
			scope : {}
		};
	}

})(); (function(){
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
	angular.module(APP.MODULE.FILE).directive("fileContent",["fileView","pageView","SITE",fileContent]);
	function fileContent(fileView,pageView,SITE){
		return {
			restrict : 'E',
			templateUrl : SITE.HTML.BASE_DIR + '/fileContent.htm',
			replace:true,
			scope : {},
			link: function(scope,element,attr){
				scope.pageView = pageView;
				scope.fileView = fileView;
			}

		};
	};
})();
 (function(){
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
			restrict : 'E',
			replace:true,
			templateUrl:SITE.HTML.BASE_DIR + '/fileLine.htm',
			link:function(scope,element,attr){
				//console.debug("line",scope.line);
				fileView.model.readLine(scope.line).then(function(result){
					scope.lineContent = result;
					scope.lineNo = scope.line.row;
				});
			}
		};
	};
})();
 (function(){
	"use strict";
	angular.module(APP.MODULE.FILE).directive("fileSelect",['fileView','pageView','FileModel','Page','FileMapGenerator','FiltersView','Filters',fileSelector]);

	function fileSelector(fileView,pageView,FileModel,Page,FileMapGenerator,FiltersView,Filters){
		/**
		 * The directive.
		 */
		return {
			restrict : 'A',
			scope : {type:'@fileSelect'},
			controller: ['$scope', '$element', '$attrs','$timeout', FileSelectorController],
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
				fileView.model = new FileModel(evt.dataTransfer.files[0]);
				pageView.model = new Page();
				FiltersView.model = new Filters();

				//filtersView.model = fileView.model.filter;
				$scope.$applyAsync();
				//console.debug("filtersView.model",filtersView.model);
				new FileMapGenerator(fileView.model).generate().then(function(result){
					console.debug("file map completed",result,fileView.model);
					fileView.model = result;
				},function(err){
					console.debug("error",err);
				},function(update){
					//console.debug(update);
					pageView.model.totalLines = update.length;
					//console.debug("notify update",new Date());
				}).finally(function(){
					console.debug("finally");
					$scope.$applyAsync();
				});
			};


		};
	};

})();
 (function(){
	"use strict";
	angular.module(APP.MODULE.FILE).factory("ChunkMapper",['$q','Line','fileReaderSrvc',ChunkMapperService]);

	function ChunkMapperService($q,Line,fileReaderSrvc){

		/**
		 * an executable for an individual chunk which can be put into the workmanager to be threaded.
		 * [ChunkMapper description]
		 * @param {[type]} start  [description]
		 * @param {[type]} end    [description]
		 * @param {[type]} reader [description]
		 */
		function ChunkMapper(start,end,file){
			this.start = start;
			this.end = end;
			this.file = file;
			this.firstLine;
			this.lastLine;
			this.lines = [];
			this.reader = new fileReaderSrvc(file);
			this.deferred;

		};
		/**
		 * returns all the values requred to re-initialise this object. (required when sending this object to the web -workers)
		 * @return {[type]} [description]
		 */
		ChunkMapper.prototype.serialize = function(){
			return {
				executable:"ChunkMapper",
				parameters:[this.start,this.end,this.file],
				properties:{
					index:this.index,
					firstLine:this.firstLine,
					lastLine:this.lastLine,
					lines:this.lines
				}
			};
		};

		ChunkMapper.prototype.execute = function(){
			this.deferred = $q.defer();
			//console.debug("execute this",this);
			this.reader.readBytes(this.start,this.end).then(this.mapChunk(this));
			return this.deferred.promise;
		};
		ChunkMapper.prototype.cancel = function(){
			this.deferred.reject("CANCELLED");
		};
		ChunkMapper.prototype.mapChunk = function(cMapper){
			//console.debug("chunk",cMapper);
			var mapper = cMapper;

			return function(chunk){
				//console.debug("chunk mapper",mapper);
				//mapper.lines = [];
				var view = new Uint8Array(chunk);
				var startLine = mapper.start;
				for (var i = 0; i < view.length; i++) {
	            	if (view[i] === 10) {
	            		var lineEnd = mapper.start + i;
	                	if(!mapper.firstLine){
	                		mapper.firstLine = new Line(startLine,lineEnd,true);
	                	}else{
	                		var line = new Line(startLine,lineEnd,true);
	                		mapper.lines.push(line);
	                	}
	                	startLine = lineEnd + 1;
	            	}
	        	}

	        	if(startLine < mapper.start + view.length){
	        		mapper.lastLine = new Line(startLine,mapper.start + view.length,false);
	        	}
	        	//console.debug("chunk",mapper.serialize());
				mapper.deferred.resolve(mapper.serialize());
			};
		};

		return ChunkMapper
	};
})();
 (function(){
	"use strict";
	angular.module(APP.MODULE.FILE).factory("ChunkProcessor",['$q','$timeout','Line',ChunkProcessorService]);

	function ChunkProcessorService($q,$timeout,Line){
		/**
		 * [ChunkProcessor description]
		 */
		function ChunkProcessor(fileModel){
			var _currentIndex = 0;
			this.fileModel = fileModel;
			this.observers = []
			Object.defineProperty(this,'currentIndex',{
				get:function(){
					return _currentIndex;
				},
				set:function(value){
					_currentIndex = value
					this._triggerObserver();
				}
			});
		};

		ChunkProcessor.prototype.processChunk = function(chunk){
			console.debug()
			var deferred = $q.defer();
			var chu = chunk.properties;

			if(chu.index === 0){
				console.debug("first chunk notify",new Date());
			}

			var observer = new _Observer(chu,this,deferred);
			this.observers[chu.index] = observer;
			this._triggerObserver();

			return deferred.promise;
		};

		/**
		 * function to cause the observer to be triggered for the current index and fire its call back
		 *
		 * @return {[type]} [description]
		 */
		ChunkProcessor.prototype._triggerObserver = function(){
			var obs = this.observers[this.currentIndex];
			if(obs){
				obs.process();
			}
		};

		/**
		 * callback function for the observer. will resolve the promise and increment the current index.(which will fire the nex observer if it is existing yet.)
		 * @param  {[type]} chunk    [description]
		 * @param  {[type]} deferred [description]
		 * @return {[type]}          [description]
		 */
		ChunkProcessor.prototype._processChunk = function(chunk,deferred){
			var def = deferred;
			var partialFileMap = chunk;
			//if this is the first one
			if(this.fileModel.lines.length === 0){
				addLine(partialFileMap.firstLine,this.fileModel);
			}else if(shouldMergeLines(this.fileModel.lines[this.fileModel.lines.length-1],partialFileMap.firstLine)){
				var mergedLine = mergeLines(this.fileModel.lines.pop(),partialFileMap.firstLine);
				addLine(mergedLine,this.fileModel);
			}

			for(var i=0;i<partialFileMap.lines.length;i++){
				addLine(partialFileMap.lines[i],this.fileModel);
			}

			if(partialFileMap.lastLine){
				addLine(partialFileMap.lastLine,this.fileModel);
			}

			this.currentIndex++;
			def.resolve(this.fileModel.lines);

		};
		function addLine(line,fileModel){
			//console.debug("addLine",fileModel);

			var ln = line;
			ln.row = fileModel.lines.length+1;
			fileModel.lines.push(ln);
		};
		function shouldMergeLines(start,end){
			return !start.hasLineFeed;
		};
		//
		function mergeLines(start,end){
			return new Line(start.start,end.end,end.hasLineFeed);
		};


		function _Observer(chunk,processor,deferred){
			this.processor = processor;
			this.deferred = deferred;
			this.chunk = chunk;
		}
		_Observer.prototype.process = function(){
			//stop observing to ensure this never runs twice for a chunk.
			delete this.processor.observers[this.chunk.index];
			//process this chunk;
			this.processor._processChunk(this.chunk,this.deferred);
		};

		return ChunkProcessor
	};
})();
 (function(){
	"use strict";
	angular.module(APP.MODULE.FILE).factory("FileMapper",['$q','WorkManager','ChunkMapper','ChunkProcessor',FileMapperFactory]);

	function FileMapperFactory($q,WorkManager,ChunkMapper,ChunkProcessor){

		// 					1B 	1KB 	1MB 	10MB
		var BUFFER_SIZE = 	1 *	1024 *	1024 *	50; //10MB

		/**
		 * will create a work manager and divide up the file into chunks. once the work manager has completed then will merge all the chunk results back together.
		 * @param {[type]} file [description]
		 */
		function FileMapper(fileModel){
			this.fileModel = fileModel;
			this.file = fileModel.file;
			this.processor = new ChunkProcessor(fileModel);
		};

		FileMapper.prototype.execute = function(){
			var chunks = this.seperateIntoChunks();

			return WorkManager.execute(chunks).then(function(result){
				return result;
			});

		};
		FileMapper.prototype.seperateIntoChunks = function(){

			var chunks  = [];

			var start = 0;
			while(start<this.file.size){
				var end = Math.min(this.file.size,start + BUFFER_SIZE);
				chunks.push(new ChunkMapper(start,end,this.file));
				chunks[chunks.length-1].index = chunks.length-1;
				start = end + 1;
			}

			return chunks;
		};
		/**
		 * Notification function. gets called once each chunk has been processed. this should take each chunk merge the first/last lines where appropriate, and put all the file lines into an array in the correct order.
		 * @param  {[type]} chunk [description]
		 * @return {[type]}       [description]
		 */
		FileMapper.prototype.processChunk = function(chunk){
			return this.processor.processChunk(chunk);
		};

		return FileMapper;
	};
})();
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
 (function () {
	"use strict";
	angular.module(APP.MODULE.FILE).factory("fileReaderSrvc",['$q',fileReaderSrvc]);
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

		return FileReaderService;
	};
})();
 (function(){
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
	"use strict"
	angular.module(APP.MODULE.FILTER).directive("ffFilter",[filter]);


	function filter(){
		/**
		 * The directive.
		 */
		return {
			restrict : 'E',
			templateUrl : './templates/filters/filter.htm',
			replace:true,
			scope : {filter:'=fltr'},
			controller: ['$scope','$element','$attrs',filterController],
			controllerAs: 'filterCtrl'
			// ,
			// link:link
		};

		// function link(scope, element, attrs){

		// };

		function filterController(scope,element, attrs){

			console.debug("filter directive link",scope.filter);
		};
	};


})();
 (function(){
	"use strict"
	angular.module(APP.MODULE.FILTER).directive("ffFilterGroup",[filterGroup]);


	function filterGroup(ffFilterGroup){
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
			console.debug("filter group directive link",scope.group);
		}

		function filterGroupController(scope,element, attrs){

			// this.addFilter = function(){
			// };
			// this.removeFilter = function(){
			// };
		};
	};


})();
 (function(){
	"use strict";
	angular.module(APP.MODULE.FILTER).directive("ffFilters",['FiltersView',filters]);

	function filters(FiltersView){
		/**
		 * The directive.
		 */
		return {
			restrict : 'E',
			templateUrl : './templates/filters/filters.htm',
			replace:true,
			scope : {},
			controller: ['$scope','$element', '$attrs',filtersController],
			controllerAs: 'filtersCtrl',
			link:function(scope,element,attr){
				console.debug("filters directive link");
				scope.view = FiltersView;
			}
		};

		function filtersController($scope,$element, $attrs){

		};
	};
})();
 (function(){
	"use strict";
	angular.module(APP.MODULE.FILTER).factory("Filter",[FilterFactory]);


	function FilterFactory(){

		function Filter(index){
			this.index = index;
			this.value;
			this.type;
			this.filterMap = [];
		};

		Filter.prototype.filter = function(index, linestring){

		};

		return Filter;
	}


})();
 (function(){
	"use strict";
	angular.module(APP.MODULE.FILTER).factory("FilterGroup",['Filter',FilterGroupFactory]);


	function FilterGroupFactory(Filter){

		function FilterGroup(index){
			this.index = index;
			this.filters = [new Filter(0)];
		};

		/**
		 * The Filter group to add to the Array
		 * @param {[type]} filterGroup [description]
		 */
		FilterGroup.prototype.addFilter = function(){
			this.filters.push(new Filter(this.filters.length));
		};
		/**
		 * remove the group from the groups array based on its index
		 * @param  {filterGroup} the filter group to remove from the groups array
		 * @return void
		 */
		FilterGroup.prototype.removeFilter = function(filter){
			this.filters.splice(filter.index,1);
		};

		return FilterGroup;
	}


})();
 (function(){
	"use strict";
	angular.module(APP.MODULE.FILTER).factory("FilterMapper",['$q','WorkManager',FilterMapperFactory]);

	function FilterMapperFactory($q,WorkManager){

		var ChunkLines = 1000;
		//no Readers for the workmanager to use
		var NO_READERS = 4;

		/**
		 * will create a work manager and divide up the file into chunks. once the work manager has completed then will merge all the chunk results back together.
		 * @param {[type]} file [description]
		 */
		function FilterMapper(fileModel,filter){
			this.fileModel = fileModel;
			this.filter = filter;
		};

		FileMapper.prototype.execute = function(){
			var chunks = this.seperateIntoChunks();
			var worker = new WorkManager(chunks,NO_READERS);

			return worker.start();

		};
		FileMapper.prototype.seperateIntoChunks = function(){

			var chunks  = [];

			return chunks;
		};
		/**
		 * Notification function. gets called once each chunk has been processed. this should take each chunk merge the first/last lines where appropriate, and put all the file lines into an array in the correct order.
		 * @param  {[type]} chunk [description]
		 * @return {[type]}       [description]
		 */
		FileMapper.prototype.processChunk = function(chunk){
			return this.processor.processChunk(chunk);
		};

		/**
		 * generate all the line numbers for the file map
		 * @param  {[type]} result [description]
		 * @return {[type]}        [description]
		 */
		FileMapper.postProcess = function(fileModel){
			//console.debug(fileModel);
			// for(var i=0;i<fileModel.lines.length;i++){
			// 	fileModel.lines[i].row = i+1;
			// }
			// return $q.resolve(fileModel);
		}

		return FileMapper;
	};
})();
 (function(){
	"use strict";
	angular.module(APP.MODULE.FILTER).factory("Filters",['FilterGroup',FiltersFactory]);


	function FiltersFactory(FilterGroup){

		function Filters(){
			this.groups = [new FilterGroup(0)];
		};

		/**
		 * The Filter group to add to the Array
		 * @param {[type]} filterGroup [description]
		 */
		Filters.prototype.addGroup = function(){
			this.groups.push(new FilterGroup(this.groups.length));
		};
		/**
		 * remove the group from the groups array based on its index
		 * @param  {filterGroup} the filter group to remove from the groups array
		 * @return void
		 */
		Filters.prototype.removeGroup = function(filterGroup){
			this.groups.splice(filterGroup.index,1);
		};

		return Filters;
	};


})();
 (function(){
	"use strict";
	angular.module(APP.MODULE.FILTER).service("FiltersView",[filtersViewService]);


	function filtersViewService(){
		this.model;
		this.visible = false;
	};
	filtersViewService.prototype.toggleVisible = function(){
		this.visible = !this.visible;
	};

})();
 (function(){
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
	angular.module(APP.MODULE.MENU).service("MenuOptionFactory", ['MenuOption','FilterOption',menuOptionFactory]);

	function menuOptionFactory(MenuOption,FilterOption){

		function MenuOptionFactory(){}

		/*
		* factory function to return the compile funtion to use for the menu selector.
		*
		*/
		MenuOptionFactory.getMenuOption = function(tElement,tAttrs){
			console.debug("getMenuOption",tElement,tAttrs);
			var rtn;
			switch(tAttrs.menuSelector) {
				case "filter":
        			rtn = new FilterOption(tElement,tAttrs);
       	 			break;
    			default:
        			rtn = new MenuOption(tElement,tAttrs);
			}
			return rtn;

		}
		return MenuOptionFactory;
	};
})();
 (function(){
	"use strict";
	angular.module(APP.MODULE.NAV).factory("FilterOption",['MenuOption','FiltersView',FilterOptionFactory]);

	function FilterOptionFactory(MenuOption,FiltersView){


		function FilterOption(tElement,tAttrs){
			return MenuOption.call(this,tElement,tAttrs);
		}

		FilterOption.prototype = Object.create(MenuOption.prototype);
		FilterOption.prototype.constructor = FilterOption;

		FilterOption.prototype.compile = function(tElement,tAttrs){
			MenuOption.prototype.compile.apply(this,[tElement,tAttrs]);
		};
		FilterOption.prototype.preLink = function(scope,iElement,iAttrs){
			MenuOption.prototype.preLink.apply(this,[scope,iElement,iAttrs]);
		};
		FilterOption.prototype.postLink = function(scope,iElement,iAttrs){
			MenuOption.prototype.postLink.apply(this,[scope,iElement,iAttrs]);

			iElement.bind('click',function(event){
				FiltersView.toggleVisible();
			});
		};

		return FilterOption;
	};
})();
 (function(){
	"use strict";
	angular.module(APP.MODULE.NAV).factory("MenuOption",[menuOption]);

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

		return MenuOption;
	};
})();
 (function(){
	"use strict";
	angular.module(APP.MODULE.MENU).directive("menuSelector", ['MenuOptionFactory',MenuSelector]);
	function MenuSelector(MenuOptionFactory){
		return {
			restrict : 'A',
			compile:MenuOptionFactory.getMenuOption

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
	angular.module(APP.MODULE.NAV).directive("pagination",["fileView","pageView","SITE",pagination]);
	function pagination(fileView,pageView,SITE){

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
})();
 (function(){
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
})(); (function(){
	"use strict";
	angular.module(APP.MODULE.NAV).factory("Page",[pageFactory]);

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
	angular.module(APP.MODULE.WORKER).config(["SITE","WorkManagerProvider",ConfigWorkManager]);

	function ConfigWorkManager(SITE,WorkManagerProvider){
		WorkManagerProvider.setPoolSize(SITE.WORK_MANAGER.THREADS);
	};

})();
 (function(){
	"use strict";
	angular.module(APP.MODULE.WORKER).provider("WorkManager",[WorkManagerProvider]);

	function WorkManagerProvider(){
		//set the workmanager pool size
		var poolSize = 1;

		return {
			setPoolSize:setPoolSize,
			$get:['$q','$timeout','WorkerPool','FFWorker',WorkManagerService]
		};

		function setPoolSize(noThreads){
			poolSize = (noThreads>0)?noThreads:1;
		};

		function WorkManagerService($q,$timeout,WorkerPool,FFWorker){
			/**
			 * runs a collection of runnable ojbect with up to the specified number of asynchronous 'threads' when one thread completes the next is run.
			 * the results should be stored by the runnable so they can be consumed later.
			 * @param {[type]} work    an runnable object  (interface with run method which returns a promise and a stop method which cancels the promise)
			 * @param {[type]} threads [description]
			 *
			 */
			function WorkManager(){
				this.pool = new WorkerPool();
			};

			WorkManager.prototype.initialise = function(){
				var pool = this.pool;
				for(var i=0;i<poolSize;i++){

					(function(ffWorker){
						ffWorker.initialise().then(function(){
							//console.debug("returning ffWorker", ffWorker.getIdentifier());
							pool.returnWorker(ffWorker);
						});
					})(new FFWorker());

				}
			};


			function ExecutionContext(work,workManager){
				var ecWork = work;
				var ecWorkManager = workManager;
				var ecWorker;

				var deferred;

				var getWorker = function(){
					//console.debug("fetching Worker",ecWorker);
					return ecWorkManager.pool.getWorker();
				};

				var doWork = function(ffWorker){
					ecWorker = ffWorker;
					//console.debug("got Worker",ecWorker);
					return ecWorker.execute(ecWork);
				};
				var processResult = function(result){
					//console.debug("got result",result);
					deferred.resolve(result);
				};
				var returnWorker = function(){
					//console.debug("returning worker to pool");
					ecWorkManager.pool.returnWorker(ecWorker);
				};
				this.execute = function(){
					deferred = $q.defer();
					getWorker()
						.then(doWork)
						.then(processResult)
						.then(returnWorker)
					return deferred.promise
				};

			};

			WorkManager.prototype.execute = function(workArray){
				var deferred = $q.defer();
				//console.debug("execute",workArray);
				//from the pool
				var promises = [];
				//get the promises of all the work.
				for(var i=0; i<workArray.length;i++){
					var work = workArray[i];
					var prmse = new ExecutionContext(work,this).execute()
						.then(function(result){
							deferred.notify(result);
							return result;
						});
					promises.push(prmse);
				}

				$q.all(promises).then(function(result){
				//$timeout(function(){
						deferred.resolve(result);
					//},0,false);

				});
				return deferred.promise;
			};

			return new WorkManager();
		};


	};

})();
 (function(){
	"use strict";
	angular.module(APP.MODULE.WORKER).run(["WorkManager",InitialiseWorkManager]);

	function InitialiseWorkManager(WorkManager){
		WorkManager.initialise();
	};

})();
 (function(){
	"use strict";
	angular.module(APP.MODULE.WORKER).factory("FFWorker",['$q','$timeout','WorkerTemplate',WorkerFactory]);

	function WorkerFactory($q,$timeout,WorkerTemplate){


		var id = 0;
		function FFWorker(){
			var identifier = id;
			id++;
			var worker;
			var lock = false;
			this.getIdentifier = function(){return identifier;};
			this.initialise = function(){
				var deferred = $q.defer();
				//get the bootable
				var template = WorkerTemplate.template();
				var blob = new Blob([template],{ type: 'application/javascript' });

				//searilaize the bootable into an object url
				var blobURL = window.URL.createObjectURL(blob);
				//instantiate the worker with the bootable

				var initFunction = function (e) {
					var eventId = e.data.event;
					if(eventId === 'initDone') {
						deferred.resolve("worker initialized");
					}else{
						//console.debug("rejecting worker init",e);
						deferred.reject(e);
					}
				};

				worker =  new Worker(blobURL);

				worker.onmessage = initFunction;
				return deferred.promise;
			};

			/**
			 * Executes an executable in a seperate thread.
			 *
			 * the executable object MUST to follow the following interface or it will be rejected by the Web Worker.
			 *
			 *	{
			 *		execute: function(){ return promise }
			 *		serialize: function(){
			 *			return {
			 *				executable:"name of object",
			 *				parameters:[parameter values to instantiate the object],
			 *				properties:{any extra properties you want assigned to the object}
			 *			}
			 *		}
			 *	}
			 *
			 * @param  {[type]} executable [description]
			 * @return returns a promise containing the result of the execute function.
			 */
			this.execute = function(executable){
				if(lock){
					return $q.reject("Worker is locked by another process");
				}
				var deferred = $q.defer();
				var msg = executable.serialize();

				var msgHandler = function(e){
					var data = e.data;
					var eventId = e.data.event;
					switch(eventId){
						case 'initDone':
							deferred.reject(e);
							break;;
						case 'success':
							deferred.resolve(data.data);
							break;;
						case 'notify':
							deferred.notify(data.data);
							break;;
						case 'error':
							deferred.reject(e);
							break;;
						default:
							console.debug("rejecting worker execute - unknow msg from worker");
							deferred.reject(e);
							break;;
					}
					lock = false;
				};

				worker.onmessage = msgHandler;
				worker.postMessage(msg);

				return deferred.promise;
			};

			this.terminate = function(){
				if(worker){
					worker.terminate();
				}
			};
		};

		return FFWorker;
	};

})();
 (function(){
	"use strict";
	angular.module(APP.MODULE.WORKER).factory("WorkerPool",['$q',WorkerPoolFactory]);

	function WorkerPoolFactory($q){
		/**
		 * Create a pool to manage the avaliable intances of the workers.
		 *
		 * will return a worker fo a request once on becomes available.
		 *
		 */
		function WorkerPool(){
			this.pool = [];
			this.queue = [];
		};

		/**
		 * A promise to return a Worker from the pool when one becomese avaliable.
		 * @return {[type]} [description]
		 */
		WorkerPool.prototype.getWorker = function(){
			var deferred = $q.defer();

			this.queue.push(deferred);

			this.notifyQueued();

			return deferred.promise;
		};

		/**
		 * once a unit of work has completed it needs to return the worker here. otherwise no more will become avaiable for other units of work.
		 * @param  {[type]} ffWorker [description]
		 * @return {[type]}          [description]
		 */
		WorkerPool.prototype.returnWorker = function(ffWorker){
			this.pool.push(ffWorker);
			this.notifyPooled();
		};

		/**
		 * used to notify the pool when a worker is requested.
		 * @return {[type]} [description]
		 */
		WorkerPool.prototype.notifyQueued = function(){
			this.resolveRequest();
		};
		/**
		 * used to notify the pool when a worker is returned.
		 * @return {[type]} [description]
		 */
		WorkerPool.prototype.notifyPooled = function(){
			this.resolveRequest();
		};

		/**
		 * resolves the request for a worker when there is both a request and a pooled worked avaliable.
		 * other wise waits for either a request to be made or a worker to be returned.
		 * @return {[type]} [description]
		 */
		WorkerPool.prototype.resolveRequest = function(){
			if(this.queue.length > 0 && this.pool.length > 0){
				var deferred = this.queue.shift();
				deferred.resolve(this.pool.pop());
			}
		};

		return WorkerPool
	};



})();
 (function(){
	"use strict";
	angular.module(APP.MODULE.WORKER).service("WorkerTemplate",[WorkerTemplate]);

	var TEMPLATE_CONST = ["",
		"APP = {",
			"NAME: 'Worker',",
			"MODULE: {",
				"FILE : 'FF_FILE',",
				"COMMON : 'FF_COMMON',",
				"FILTER : 'FF_FILTER',",
				"WORKER : 'FF_WORKER'",
			"}",
		"};",


		"var window = self;",
		// Skeleton properties to get Angular to load and bootstrap.
		"self.history = {};",
		"var document = {",
			"readyState: 'complete',",
			"cookie: '',",
			"querySelector: function () {},",
			"createElement: function () {",
				"return {",
					"pathname: '',",
					"setAttribute: function () {}",
				"};",
			"}",
		"};",

		"importScripts('http://localhost/split/lib/angular/angular.min.js');",
		"importScripts('http://localhost/split/dist/javascript/Worker.comb.js');",

		"angular = window.angular;",

		//initialise the module.
		"angular.module(APP.NAME,[APP.MODULE.WORKER,APP.MODULE.FILE]);",

		//bootstrap the module.
		"angular.bootstrap(null, [APP.NAME]);"].join("\n");

	function WorkerTemplate(){
		return {
			template : template
		};
	};
	function template(){
		// var tmpl = "";
		// for(var i in TEMPLATE_CONST){
		// 	tmpl = tmpl.concat([i]);
		// }
		return TEMPLATE_CONST;
	};
})();

//# sourceMappingURL=FileFilter.comb.js.map
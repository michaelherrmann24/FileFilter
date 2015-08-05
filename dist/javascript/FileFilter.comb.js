(function(){
	
	APP = {
		NAME: "FileFilter",
		MODULE: {
			MAIN : "FF_Main",
			FILE : "FF_File",
			COMMON : "FF_Common",
			NAV : "FF_Nav",
			NAV : "FF_Filters",
			MENU : "FF_MENU"
		}
	};
	
	"use strict";
	
	angular.element(document).ready(function() {
		
		//initialise the module.    
		angular.module(APP.NAME,[APP.MODULE.MAIN,APP.MODULE.FILE ,APP.MODULE.COMMON,APP.MODULE.NAV,APP.MODULE.MENU]);
		
		//bootstrap the module.
		angular.bootstrap(document, [APP.NAME]);
		
	});
})();;(function(){
	"use strict";
	angular.module(APP.MODULE.COMMON,[]);
})();
;(function(){
	"use strict";
	angular.module(APP.MODULE.FILE,[]);
})();;(function(){
	"use strict"
	angular.module(APP.MODULE.FILTERS,[]);
})();;(function(){
	"use strict";
	angular.module(APP.MODULE.MAIN,[]);
})();;(function(){
	"use strict";
	angular.module(APP.MODULE.MENU,[]);
})();;(function(){
	"use strict";
	angular.module(APP.MODULE.NAV,[]);
})();;(function(){
    "use strict";
    angular.module(APP.MODULE.COMMON).config(['$provide', '$logProvider',logConfig]);

    function logConfig($provide, $logProvider) {
        $provide.decorator('$log', function ($delegate) {
            var originalFns = {};

            // Store the original log functions
            angular.forEach($delegate, function (originalFunction, functionName) {
                originalFns[functionName] = originalFunction;
            });

            var functionsToDecorate = ['log','info','debug', 'warn'];

            // Apply the decorations
            angular.forEach(functionsToDecorate, function (functionName) {
                $delegate[functionName] = logDecorator(originalFns[functionName]);
            });

            return $delegate;
        });
    };


    function logDecorator(fn) {
        return function () {
            var args = [].slice.call(arguments);

            // Insert a separator between the existing log message(s) and what we're adding.

            // Use (instance of Error)'s stack to get the current line.
            var stack = (new Error()).stack.split('\n').slice(1);

            // Throw away the first item because it is the `$log.fn()` function, 
            // but we want the code that called `$log.fn()`.
            stack.shift();
            
            var callerStackline = stack[0].trim();

            //var regex = new RegExp (/\(([^()]+)\)/g);
            
            var callingFile = callerStackline.match(/\(([^()]+)\)/g);
            //extract what we want. 
            var splitLine = callerStackline.split(" "); 
            var callingFunction = splitLine[1]; 
            var a = callingFile[0].split(":");
            
            var splitFilePath = a[1].split("/");
            var file = splitFilePath[splitFilePath.length-1];
            var line = a[2];

            args.unshift(file+":"+line+":"+callingFunction);

            // Call the original function with the new args.
            fn.apply(fn, args);
        };
    };

})();;(function(){
	"use script";
	angular.module(APP.MODULE.COMMON).config([config]);

	function config(){

	};
})();;(function(){
	"use strict"
	angular.module(APP.MODULE.COMMON).directive("svgInclude",[svgInclude]);
	
	function svgInclude(){
		/**
		 * The directive. 
		 */
		return {
			restrict : 'E',
			templateUrl : './dist/svg/svg-defs.svg',
			replace:true,
			scope : {}
		};
	}

})();;(function(){
	"use strict";
	angular.module(APP.MODULE.FILE).directive("fileContent",["$log","fileView","pageView",fileContent]);
	function fileContent($log,fileView,pageView){
		return {
			restrict : 'E',
			templateUrl : './templates/fileContent.htm',
			replace:true,
			scope : {},
			link: function(scope,element,attr){
				scope.pageView = pageView;
				scope.fileView = fileView;
			}
		};
	};
})();;(function(){
	angular.module(APP.MODULE.FILE).directive("fileDetails",['fileView',fileDetails]);
	
	function fileDetails(fileView){
		/**
		 * The directive. 
		 */
		return {
			restrict : 'E',
			templateUrl : './templates/fileDetails.htm',
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
})();;(function(){
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
})();;(function(){
	"use strict";
	angular.module(APP.MODULE.FILE).directive("fileLine",["$log","fileView",fileLine]);
	
	function fileLine($log,fileView){
		return {
			restrict : 'A',
			link:function(scope,element,attr){

				fileView.model.readLine(scope.line).then(function(result){
					scope.lineContent = result;
				});
			}
		};
	};
})();
;(function () {
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
})();;(function(){
	"use strict";
	angular.module(APP.MODULE.FILE).directive("fileSelect",['$log','fileView','pageView','fileFactory','pageFactory',fileSelector]);
	
	function fileSelector($log,fileView,pageView,fileFactory,pageFactory){
		/**
		 * The directive. 
		 */
		return {
			restrict : 'A',
			scope : {},
			controller: ['$scope', '$element', '$attrs', FileSelectorController],
			controllerAs: 'fileSelectCtrl',
			link:function(){
				$log.log("initialize file selector directive.");
			}
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
			    
				fileView.model = fileFactory.newInstance(evt.dataTransfer.files[0]);
				fileView.model.generateFileMap();
				pageView.model = pageFactory.newInstance(fileView.model);
				$scope.$apply();
			};
		};
	};
	
})();
;(function(){
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
})();;(function(){
	"use strict";
	angular.module(APP.MODULE.FILE).service("fileView",["$log",FileView]);

	function FileView($log){
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
})();;(function(){
	"use strict";
	angular.module(APP.MODULE.FILTERS).directive("filters",[filters]);

	function filters(){
		/**
		 * The directive. 
		 */
		return {
			restrict : 'E',
			templateUrl : './templates/filters.htm',
			replace:true,
			scope : {},
			controller: ['$scope', '$element', '$attrs',filtersController],
			controllerAs: 'filterCtrl'
		};

		function filtersController($scope,$element, $attrs){

		};
	};
})();;(function(){
	"use strict";
	var mainModule = angular.module(APP.MODULE.MAIN);
	
	mainModule.controller("mainController",['$scope','mainModel','$log',MainController]);
	
	/**
	 * managers the root level of the application.
	 */
	function MainController($scope,mainModel,$log){
		
		//$log.info('Initialize main controller');
		this.model = mainModel;

		$scope.countDigests = function() {
   		//	$log.info('Digest');
		}

		$scope.$watch('countDigests()');
	}	
})();;(function(){
	"use strict"
	//this is a service because there should only ever be 1 instance. 
	angular.module(APP.MODULE.MAIN).service("mainModel",[mainModel]);
	
	function mainModel(){
	
		function MainModel(){
			this.fileModel;
			this.filteredFileManager;
		};
		
		MainModel.prototype.setFileModel = function(fileModel){
			this.fileModel = fileModel;
			this.fileModel.generateFileMap();
		};
		
		MainModel.prototype.setFilteredFileModel = function(fileModel){
			this.filteredFileModel = fileModel;
			this.fileModel.generateFileMap();
		}
		
		MainModel.prototype.setPageModel = function(pageModel){
			this.pageModel = pageModel;
		};

		MainModel.prototype.getFileModel = function(){
			return this.fileModel;
		};
		
		return new MainModel();
	};
})();;(function(){
	"use strict";
	angular.module(APP.MODULE.MENU).directive("menu", [Menu]);
	function Menu(){
		return {
			restrict : 'E',
			templateUrl:"./templates/menu.htm",
			replace:true,
			scope : {},
			controller: ['$scope', '$element', '$attrs', MenuController],
			controllerAs: 'menuCtrl',
			link:function(){
				console.debug("menu directive");
			}
		};

		function MenuController($scope, $element, $attrs){

		};
	};
})(); 
;(function(){
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
})();;(function(){
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
})();;(function(){
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
})();;(function(){
	"use strict";
	angular.module(APP.MODULE.NAV).factory("pageFactory",["$log",pageFactory]);
	
	function pageFactory($log){
		
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
;(function(){
	"use strict";
	angular.module(APP.MODULE.NAV).service("pageView",['$log',pageView]);

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
})();;(function(){
	"use strict";
	angular.module(APP.MODULE.NAV).directive("pagination",["$log","fileView","pageView","pageFactory",pagination]);
	function pagination($log,fileView,pageView,pageFactory){
	
		
		
		/**
		 * The directive. 
		 */
		return {
			restrict : 'E',
			templateUrl : './templates/pagination.htm',
			replace:true,
			scope : {},
			controller: ['$scope', '$element', '$attrs', PaginationController],
			controllerAs: 'pagingCtrl',
		};
		
		function PaginationController($scope, $element, $attrs){

			$scope.pageView = pageView;	
			
			this.next = function(){
				$log.debug("next", $scope.currentPage, $scope.totalPages);
				
				
			};
			this.prev = function(){
				$log.debug("prev");
				
			};
			
			this.first = function(){
				$log.debug("first");
				pageView.model.currentPage = 1;
				$scope.$apply();
			};
			
			this.last = function(){
				$log.debug("last");
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
				if(angular.isDefined(fileView.model) && angular.isDefined(fileView.model.fileMap)){
					return fileView.model.fileMap.length;
				} 
				return 0;
			};
		};
	};
})();;(function(){
	"use strict";
	angular.module(APP.MODULE.NAV).directive("pagingDetails",['pageView',pagingDetails]);
	function pagingDetails(pageView){
		/**
		 * The directive. 
		 */
		return {
			restrict : 'E',
			templateUrl : './templates/pagingDetails.htm',
			replace:true,
			scope : {},
			link:function($scope){
				$scope.pageView = pageView;
			}
		};
	};
})();;(function(){
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
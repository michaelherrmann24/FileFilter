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

})(); (function(){
	"use strict"
	angular.module(APP.MODULE.COMMON).constant("SITE",{
		HTML : {
			BASE_DIR : "./dist/templates"
		}
	});
})();  (function(){
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

		function processCompile(tElem, tAttrs){
			console.debug("compile",tElem, tAttrs);
		};
		function preLink(scope,iElem,iAttrs){
			console.debug("pre link",scope,iElem,iAttrs);
		};
		function postLink(scope,iElem,iAttrs){
			console.debug("post link",scope,iElem,iAttrs);
		};
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
	angular.module(APP.MODULE.FILE).directive("fileContent",["$log","fileView","pageView","SITE",fileContent]);
	function fileContent($log,fileView,pageView,SITE){
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
})(); (function(){
	"use strict";
	angular.module(APP.MODULE.FILE).directive("fileLine",["$log","fileView","SITE",fileLine]);
	
	function fileLine($log,fileView,SITE){
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
	angular.module(APP.MODULE.FILE).directive("fileSelect",['$log','$timeout','fileView','pageView','fileFactory','pageFactory',fileSelector]);
	
	function fileSelector($log,$timeout,fileView,pageView,fileFactory,pageFactory){
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
			    
				fileView.model = fileFactory.newInstance(evt.dataTransfer.files[0]);
				fileView.model.generateFileMap();
				pageView.model = pageFactory.newInstance(fileView.model);
				$scope.$apply();
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
})(); (function(){
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
})(); (function(){
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
})(); (function(){
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
			link:function(scope,element,attr){
				console.debug("menu directive",scope,element,attr);
			}
		};

		function MenuController($scope, $element, $attrs){

		};
	};
})(); 
 (function(){
	"use strict";
	angular.module(APP.MODULE.MENU).service("menuOptionFactory", ['menuOption','filterOption',menuOptionFactory]);
	
	function menuOptionFactory(menuOption,filterOption){
		

		function MenuOptionFactory(){

		}

		/*
		* factory function to return the compile funtion to use for the menu selector. 
		*
		*/
		MenuOptionFactory.getMenuOption = function(tElement,tAttrs){
			console.debug("MenuOptionFactory.getMenuOption",tElement,tAttrs);
			var rtn;

			switch(tAttrs.menuSelector) {
    			case "filter":
        			rtn = filterOption.newInstance(tElement,tAttrs);
       	 			break;
    			default:
        			rtn = menuOption.newInstance(tElement,tAttrs);
			}

			console.debug("menuOptionFactory",rtn);
			return rtn;

		}
		return MenuOptionFactory;
	};
})(); 
 (function(){
	"use strict";
	angular.module(APP.MODULE.NAV).factory("filterOption",['menuOption',filterOption]);
	
	function filterOption(menuOption){
		
		
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
				console.debug("click - toggle filter visibility");
				
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
			
			console.debug("MenuOption",this);

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
})(); (function(){
	"use strict";
	angular.module(APP.MODULE.NAV).directive("pagination",["$log","fileView","pageView","pageFactory","SITE",pagination]);
	function pagination($log,fileView,pageView,pageFactory,SITE){
	
		
		
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
					console.debug("watch update page ");
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
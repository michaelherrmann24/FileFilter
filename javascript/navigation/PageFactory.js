(function(){
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

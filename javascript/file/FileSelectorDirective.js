(function(){
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

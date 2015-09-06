(function(){
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

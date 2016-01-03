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

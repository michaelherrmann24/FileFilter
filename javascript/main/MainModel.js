(function(){
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
})();
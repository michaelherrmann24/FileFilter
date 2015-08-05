(function(){
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
})();
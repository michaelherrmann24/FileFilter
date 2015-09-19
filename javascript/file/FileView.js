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
})();
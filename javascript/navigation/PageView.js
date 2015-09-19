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
})();
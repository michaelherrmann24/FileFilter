(function(){
	"use strict";
	angular.module(APP.MODULE.WORKER).service("WorkerTemplate",['$location',WorkerTemplate]);

	function template(url){
		return ["",
		"APP = {",
			"NAME: 'Worker',",
			"MODULE: {",
				"FILE : 'FF_FILE',",
				"FILTER : 'FF_FILTER',",
				"COMMON : 'FF_COMMON',",
				"FILTER : 'FF_FILTER',",
				"WORKER : 'FF_WORKER'",
			"}",
		"};",


		"var window = self;",
		// Skeleton properties to get Angular to load and bootstrap.
		"self.history = {};",
		"var document = {",
			"readyState: 'complete',",
			"cookie: '',",
			"querySelector: function () {},",
			"createElement: function () {",
				"return {",
					"pathname: '',",
					"setAttribute: function () {}",
				"};",
			"}",
		"};",
		"importScripts('"+url+"dist/lib/ng.min.js');",
		"importScripts('"+url+"dist/javascript/Worker.min.js');",
		"angular = window.angular;",

		//initialise the module.
		"angular.module(APP.NAME,[APP.MODULE.WORKER,APP.MODULE.FILE,APP.MODULE.FILTER]);",

		//bootstrap the module.
		"angular.bootstrap(null, [APP.NAME]);"].join("");
	};

	function WorkerTemplate($location){
		function getTemplate(){
			var temp = template($location.absUrl());
			return temp;
		};
		return {
			template : getTemplate
		};
	};

})();

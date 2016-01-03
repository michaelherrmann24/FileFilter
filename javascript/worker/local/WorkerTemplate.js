(function(){
	"use strict";
	angular.module(APP.MODULE.WORKER).service("WorkerTemplate",[WorkerTemplate]);

	var TEMPLATE_CONST = ["",
		"APP = {",
			"NAME: 'Worker',",
			"MODULE: {",
				"FILE : 'FF_FILE',",
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

		"importScripts('http://localhost/split/lib/angular/angular.min.js');",
		"importScripts('http://localhost/split/dist/javascript/Worker.comb.js');",

		"angular = window.angular;",

		//initialise the module.
		"angular.module(APP.NAME,[APP.MODULE.WORKER,APP.MODULE.FILE]);",

		//bootstrap the module.
		"angular.bootstrap(null, [APP.NAME]);"].join("\n");

	function WorkerTemplate(){
		return {
			template : template
		};
	};
	function template(){
		// var tmpl = "";
		// for(var i in TEMPLATE_CONST){
		// 	tmpl = tmpl.concat([i]);
		// }
		return TEMPLATE_CONST;
	};
})();

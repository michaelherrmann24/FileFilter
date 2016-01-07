(function(){
	"use strict";
	angular.module(APP.MODULE.WORKER).factory("FFLocalWorker",['$q','$timeout',LocalWorkerFactory]);

	function LocalWorkerFactory($q,$timeout){


		var id = 0;
		function LocalWorker(){
			var identifier = id;
			id++;
			var worker;
			var lock = false;
			this.getIdentifier = function(){return identifier;};
			this.initialise = function(){
				return $q.when("worker initialized");
			};

			/**
			 * Executes an executable in a seperate thread.
			 *
			 * the executable object MUST to follow the following interface or it will be rejected by the Web Worker.
			 *
			 *	{
			 *		execute: function(){ return promise }
			 *		serialize: function(){
			 *			return {
			 *				executable:"name of object",
			 *				parameters:[parameter values to instantiate the object],
			 *				properties:{any extra properties you want assigned to the object}
			 *			}
			 *		}
			 *	}
			 *
			 * @param  {[type]} executable [description]
			 * @return returns a promise containing the result of the execute function.
			 */
			this.execute = function(executable){
				if(lock){
					return $q.reject("Worker is locked by another process");
				}
				var deferred = $q.defer();

				executable.execute().then(function(result){
					deferred.resolve(executable);
				}.bind(this));

				return deferred.promise;
			};

			this.terminate = function(){};
		};

		return LocalWorker;
	};

})();

(function(){
	"use strict";
	angular.module(APP.MODULE.WORKER).factory("FFWorker",['$q','$timeout','WorkerTemplate',WorkerFactory]);

	function WorkerFactory($q,$timeout,WorkerTemplate){


		var id = 0;
		function FFWorker(){
			var identifier = id;
			id++;
			var worker;
			var lock = false;
			this.getIdentifier = function(){return identifier;};
			this.initialise = function(){
				var deferred = $q.defer();
				//get the bootable
				var template = WorkerTemplate.template();
				var blob = new Blob([template],{ type: 'application/javascript' });

				//searilaize the bootable into an object url
				var blobURL = window.URL.createObjectURL(blob);
				//instantiate the worker with the bootable

				var initFunction = function (e) {
					var eventId = e.data.event;
					if(eventId === 'initDone') {
						deferred.resolve("worker initialized");
					}else{
						deferred.reject(e);
					}
				};

				worker =  new Worker(blobURL);

				worker.onmessage = initFunction;
				return deferred.promise;
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
				var msg = executable.serialize();

				var msgHandler = function(e){
					var data = e.data;
					var eventId = e.data.event;
					switch(eventId){
						case 'initDone':
							deferred.reject(e);
							break;;
						case 'success':
							deferred.resolve(data.data);
							break;;
						case 'notify':
							deferred.notify(data.data);
							break;;
						case 'error':
							deferred.reject(e);
							break;;
						default:
							console.debug("rejecting worker execute - unknow msg from worker");
							deferred.reject(e);
							break;;
					}
					lock = false;
				};

				worker.onmessage = msgHandler;
				worker.postMessage(msg);

				return deferred.promise;
			};

			this.terminate = function(){
				if(worker){
					worker.terminate();
				}
			};
		};

		return FFWorker;
	};

})();

(function(){

	angular.module(APP.MODULE.WORKER).run(['$q','$window','$injector',Runner]);

	/**
	 * Worker side executable which will create a new instance of an (angular factory) and call the execute function on it.
	 * @param {[type]} $q        [description]
	 * @param {[type]} $window   [description]
	 * @param {[type]} $injector [description]
	 */
	function Runner($q,$window,$injector){
		angular.element($window).on('message',function(event){

			var input = event.data;
			var output = $q.defer();

			var promise = output.promise;
			promise.then(postSuccess,postError,postNotify);

			if($injector.has(input.executable)){
				//get the executable from the injector
				var executable = $injector.get(input.executable);
				//create a new instance of it. (assumes it is a factory)
				var exec = Object.create(executable.prototype);
				//adds the contextual data to the obejct (ie. calls the constructor with required arguments)
				executable.apply(exec, input.parameters);

				for(var i in input.properties){
					exec[i] = input.properties[i];
				}

				//executes the runnable. resolving its promise appropriately
				if (typeof exec.execute == 'function') {
					exec.execute().then(resolveSuccess,resolveError,resolveNotify);
				}else{
					output.reject("executable does not contain an execute function");
				}
			}else{
				output.reject("Executable not Injectable");
			}

			function resolveSuccess(result){
				output.resolve(result);
			};

			function resolveError(result){
				output.reject(result);
			};

			function resolveNotify(result){
				output.notify(result);
			};

		});

		postMessage({event:'initDone'});

		function postSuccess(result){
			postMessage({event:"success",data:result});
		};

		function postError(result){
			postMessage({event:"error",data:result});
		};

		function postNotify(result){
			postMessage({event:"notify",data:result});
		};

	};

})();

(function(){
	"use strict";
	angular.module(APP.MODULE.WORKER).provider("WorkManager",[WorkManagerProvider]);

	function WorkManagerProvider(){
		//set the workmanager pool size
		var poolSize = 1;

		return {
			setPoolSize:setPoolSize,
			$get:['$q','$timeout','WorkerPool','FFWorker',WorkManagerService]
		};

		function setPoolSize(noThreads){
			poolSize = (noThreads>0)?noThreads:1;
		};

		function WorkManagerService($q,$timeout,WorkerPool,FFWorker){
			/**
			 * runs a collection of runnable ojbect with up to the specified number of asynchronous 'threads' when one thread completes the next is run.
			 * the results should be stored by the runnable so they can be consumed later.
			 * @param {[type]} work    an runnable object  (interface with run method which returns a promise and a stop method which cancels the promise)
			 * @param {[type]} threads [description]
			 *
			 */
			function WorkManager(){
				this.pool = new WorkerPool();
			};

			WorkManager.prototype.initialise = function(){
				var pool = this.pool;
				for(var i=0;i<poolSize;i++){

					(function(ffWorker){
						ffWorker.initialise().then(function(){
							//console.debug("returning ffWorker", ffWorker.getIdentifier());
							pool.returnWorker(ffWorker);
						});
					})(new FFWorker());

				}
			};


			function ExecutionContext(work,workManager){
				var ecWork = work;
				var ecWorkManager = workManager;
				var ecWorker;

				var deferred;

				var getWorker = function(){
					//console.debug("fetching Worker",ecWorker);
					return ecWorkManager.pool.getWorker();
				};

				var doWork = function(ffWorker){
					ecWorker = ffWorker;
					//console.debug("got Worker",ecWorker);
					return ecWorker.execute(ecWork);
				};
				var processResult = function(result){
					//console.debug("got result",result);
					deferred.resolve(result);
				};
				var returnWorker = function(){
					//console.debug("returning worker to pool");
					ecWorkManager.pool.returnWorker(ecWorker);
				};
				this.execute = function(){
					deferred = $q.defer();
					getWorker()
						.then(doWork)
						.then(processResult)
						.then(returnWorker)
					return deferred.promise
				};

			};

			WorkManager.prototype.execute = function(workArray){
				var deferred = $q.defer();
				//console.debug("execute",workArray);
				//from the pool
				var promises = [];
				//get the promises of all the work.
				for(var i=0; i<workArray.length;i++){
					var work = workArray[i];
					var prmse = new ExecutionContext(work,this).execute()
						.then(function(result){
							deferred.notify(result);
							return result;
						});
					promises.push(prmse);
				}

				$q.all(promises).then(function(result){
				//$timeout(function(){
						deferred.resolve(result);
					//},0,false);

				});
				return deferred.promise;
			};

			return new WorkManager();
		};


	};

})();

(function(){
	"use strict";
	angular.module(APP.MODULE.WORKER).provider("WorkManager",[WorkManagerProvider]);

	function WorkManagerProvider(){
		//set the workmanager pool size
		var poolSize = 1;
		var useWorkers = false;
		return {
			setPoolSize:setPoolSize,
			useWorker:setUseWorkers,
			$get:['$q','$timeout','WorkerPool','FFLocalWorker','FFWorker',WorkManagerService]
		};

		function setPoolSize(noThreads){
			poolSize = (noThreads>0)?noThreads:1;
		};
		function setUseWorkers(bool){
			useWorkers = bool;
		};

		function WorkManagerService($q,$timeout,WorkerPool,FFLocalWorker,FFWorker){
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
							pool.returnWorker(ffWorker);
						});
					})((useWorkers)?new FFWorker():new FFLocalWorker());

				}
			};

			/**
			 * a scope for an individual item of work to be able to execute.
			 * @param {[type]} work        [description]
			 * @param {[type]} workManager [description]
			 */
			function ExecutionContext(work,workManager){
				var ecWork = work;
				var ecWorkManager = workManager;
				var ecWorker;

				var deferred;

				var getWorker = function(){
					return ecWorkManager.pool.getWorker();
				};

				var doWork = function(ffWorker){
					ecWorker = ffWorker;
					return ecWorker.execute(ecWork);
				};
				var processResult = function(result){
					deferred.resolve(result);
				};
				var returnWorker = function(){
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
				//from the pool
				var promises = [];
				//get the promises of all the work.
				workArray.forEach(function(work){
					var prmse = new ExecutionContext(work,this).execute()
						.then(function(result){
							deferred.notify(result);
							return result;
						});
					promises.push(prmse);
				}.bind(this));

				$q.all(promises).then(function(result){
					deferred.resolve(result);
				});
				return deferred.promise;
			};

			WorkManager.prototype.terminate = function(){

			};

			return new WorkManager();
		};


	};

})();

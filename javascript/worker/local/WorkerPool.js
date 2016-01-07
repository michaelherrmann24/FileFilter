(function(){
	"use strict";
	angular.module(APP.MODULE.WORKER).factory("WorkerPool",['$q','$timeout',WorkerPoolFactory]);

	function WorkerPoolFactory($q,$timeout){
		/**
		 * Create a pool to manage the avaliable intances of the workers.
		 *
		 * will return a worker fo a request once on becomes available.
		 *
		 */
		function WorkerPool(){
			this.pool = [];
			this.queue = [];
			this.terminate = false;
		};

		/**
		 * A promise to return a Worker from the pool when one becomese avaliable.
		 * @return {[type]} [description]
		 */
		WorkerPool.prototype.getWorker = function(){
			var deferred = $q.defer();

			this.queue.push(deferred);

			this.notifyQueued();

			return deferred.promise;
		};

		/**
		 * once a unit of work has completed it needs to return the worker here. otherwise no more will become avaiable for other units of work.
		 * @param  {[type]} ffWorker [description]
		 * @return {[type]}          [description]
		 */
		WorkerPool.prototype.returnWorker = function(ffWorker){
			this.pool.push(ffWorker);
			this.notifyPooled();
		};

		/**
		 * used to notify the pool when a worker is requested.
		 * @return {[type]} [description]
		 */
		WorkerPool.prototype.notifyQueued = function(){
			this.resolveRequest();
		};
		/**
		 * used to notify the pool when a worker is returned.
		 * @return {[type]} [description]
		 */
		WorkerPool.prototype.notifyPooled = function(){
			this.resolveRequest();
		};

		/**
		 * resolves the request for a worker when there is both a request and a pooled worked avaliable.
		 * other wise waits for either a request to be made or a worker to be returned.
		 * @return {[type]} [description]
		 */
		WorkerPool.prototype.resolveRequest = function(){
			if(this.terminate){
				this._termiante();
			}else if(this.queue.length > 0 && this.pool.length > 0){
				var deferred = this.queue.shift();
				var wrker = this.pool.pop();
				//put a timeout on the worker to see if that helps GC
				//$timeout(function(){
					deferred.resolve(wrker);
				//},500,false)

			}
		};


		WorkerPool.prototype.terminate  = function(){
			this.terminate = true;
		};

		WorkerPool.prototype._terminate  = function(){
			this.queue.forEach(function(req){
				req.reject("terminated");
			}.bind(this));
			this.queue = [];

			this.pool.forEach(function(wkr){
				wkr.termiante();
			}.bind(this));
			this.pool = [];
		};

		return WorkerPool
	};

})();

(function(){
	"use strict";
	angular.module(APP.MODULE.FILE,[]);
})(); (function(){
	"use strict";
	angular.module(APP.MODULE.WORKER,[]);
})();
 (function(){
	"use strict";
	angular.module(APP.MODULE.FILE).factory("ChunkMapper",['$q','Line','fileReaderSrvc',ChunkMapperService]);

	function ChunkMapperService($q,Line,fileReaderSrvc){

		/**
		 * an executable for an individual chunk which can be put into the workmanager to be threaded.
		 * [ChunkMapper description]
		 * @param {[type]} start  [description]
		 * @param {[type]} end    [description]
		 * @param {[type]} reader [description]
		 */
		function ChunkMapper(start,end,file){
			this.start = start;
			this.end = end;
			this.file = file;
			this.firstLine;
			this.lastLine;
			this.lines = [];
			this.reader = new fileReaderSrvc(file);
			this.deferred;

		};
		/**
		 * returns all the values requred to re-initialise this object. (required when sending this object to the web -workers)
		 * @return {[type]} [description]
		 */
		ChunkMapper.prototype.serialize = function(){
			return {
				executable:"ChunkMapper",
				parameters:[this.start,this.end,this.file],
				properties:{
					index:this.index,
					firstLine:this.firstLine,
					lastLine:this.lastLine,
					lines:this.lines
				}
			};
		};

		ChunkMapper.prototype.execute = function(){
			this.deferred = $q.defer();
			//console.debug("execute this",this);
			this.reader.readBytes(this.start,this.end).then(this.mapChunk(this));
			return this.deferred.promise;
		};
		ChunkMapper.prototype.cancel = function(){
			this.deferred.reject("CANCELLED");
		};
		ChunkMapper.prototype.mapChunk = function(cMapper){
			//console.debug("chunk",cMapper);
			var mapper = cMapper;

			return function(chunk){
				//console.debug("chunk mapper",mapper);
				//mapper.lines = [];
				var view = new Uint8Array(chunk);
				var startLine = mapper.start;
				for (var i = 0; i < view.length; i++) {
	            	if (view[i] === 10) {
	            		var lineEnd = mapper.start + i;
	                	if(!mapper.firstLine){
	                		mapper.firstLine = new Line(startLine,lineEnd,true);
	                	}else{
	                		var line = new Line(startLine,lineEnd,true);
	                		mapper.lines.push(line);
	                	}
	                	startLine = lineEnd + 1;
	            	}
	        	}

	        	if(startLine < mapper.start + view.length){
	        		mapper.lastLine = new Line(startLine,mapper.start + view.length,false);
	        	}
	        	//console.debug("chunk",mapper.serialize());
				mapper.deferred.resolve(mapper.serialize());
			};
		};

		return ChunkMapper
	};
})();
 (function(){
	"use strict";
	angular.module(APP.MODULE.FILE).factory("Line",[LineFactory]);

	function LineFactory(){

		function LineModel(start,end,hasLinefeed){
			this.row;
			this.start = start;
			this.end = end;
			this.hasLineFeed = hasLinefeed;
		};

		return LineModel
	};
})();
 (function () {
	"use strict";
	angular.module(APP.MODULE.FILE).factory("fileReaderSrvc",['$q',fileReaderSrvc]);
	var notified = false;
	function fileReaderSrvc($q){

		/**
		 * wrapped FileReader service.
		 */
		function FileReaderService(file){
			this.file = file;
		};

		/**
		 * read the specified chunk fo a file.
		 * @param startBytes
		 * @param endBytes
		 * @returns
		 */
		FileReaderService.prototype.readBytes = function(startBytes,endBytes){
			var deferred = $q.defer();
			var reader = getReader(deferred);
			reader.readAsArrayBuffer(this.file.slice(startBytes,endBytes));
			return deferred.promise;
		};

		/**
		 * read the specified chunk fo a file.
		 * @param startBytes
		 * @param endBytes
		 * @returns
		 */
		FileReaderService.prototype.read = function(startBytes,endBytes){
			var deferred = $q.defer();
			var reader = getReader(deferred);
			reader.readAsText(this.file.slice(startBytes,endBytes));
			return deferred.promise;
		};

		/**
		 * resolve the promise on file loaded successfully.
		 */
		function onLoad(reader, deferred) {
            return function () {
            	deferred.resolve(reader.result);
            };
        };

        /**
         * reject the promise on file read error
         */
        function onError(reader, deferred) {
            return function () {
            	deferred.reject(reader.result);
            };
        };

        /**
         * get a FileReader setup with onLoad and onError logic for promise based retrieval.
         */
        function getReader(deferred) {
            var reader = new FileReader(); //std javascript file reader object.
            reader.onload = onLoad(reader, deferred);
            reader.onerror = onError(reader, deferred);
            return reader;
        };

		return FileReaderService;
	};
})();
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

//# sourceMappingURL=Worker.comb.js.map
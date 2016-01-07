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
			this.index;
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
			this.reader.readBytes(this.start,this.end).then(this.mapChunk.bind(this));
			return this.deferred.promise;
		};
		ChunkMapper.prototype.cancel = function(){
			this.deferred.reject("CANCELLED");
		};
		ChunkMapper.prototype.mapChunk = function(chunk){

				var view = new Uint8Array(chunk);
				var startLine = this.start;
				for (var i = 0; i < view.length; i++) {
	            	if (view[i] === 10) {
	            		var lineEnd = this.start + i;
	                	if(!this.firstLine){
	                		this.firstLine = new Line(startLine,lineEnd,true);
	                	}else{
	                		var line = new Line(startLine,lineEnd,true);
	                		this.lines.push(line);
	                	}
	                	startLine = lineEnd + 1;
	            	}
	        	}

	        	if(startLine < this.start + view.length){
	        		this.lastLine = new Line(startLine,this.start + view.length,false);
	        	}
				this.deferred.resolve(this);
		};

		return ChunkMapper
	};
})();

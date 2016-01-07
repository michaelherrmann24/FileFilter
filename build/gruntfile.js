/*
 * SwiftShop Gruntfile
 */

'use strict';

/**
 * Grunt module
 */
module.exports = function(grunt) {

	/**
     * Dynamically load npm tasks
     */
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// configure the tasks
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        project : {
        	basedir: '..',
			dist: '<%= project.basedir %>/dist',
			css:{
				src:'<%= project.basedir %>/css',
				dist:'<%= project.dist %>/css',
				combfile: 'main.css',
				minfile: 'main.min.css',
			},
			ng :{
				src: '<%= project.basedir %>/lib/angular',
				dist:'<%= project.dist %>/lib',
				combfile: 'ng.min.js'
			},
			js :{
				src: '<%= project.basedir %>/javascript',
				dist:'<%= project.dist %>/javascript',
				combfile: 'FileFilter.comb.js',
				minfile: 'FileFilter.min.js'
			},
			worker :{
				src: '<%= project.basedir %>/javascript',
				dist:'<%= project.dist %>/javascript',
				combfile: 'Worker.comb.js',
				minfile: 'Worker.min.js'
			},
			svg: {
				src:'<%= project.basedir %>/svg',
				dist:'<%= project.dist %>/svg',
				combfile: 'svg-defs.comb.svg',
				minfile: 'svg-defs.comb.min.svg'
			},
			html: {
				src:'<%= project.basedir %>/templates',
				dist:'<%= project.dist %>/templates'
			}
		},
		copy:{
			svg:{
				files:[
					{expand: true, src: ['<%= project.svg.src %>/**'], dest: '<%= project.svg.dist %>/'}
				]
			}
		},
		concat : {
			options: {
				separator: ' ',
				sourceMap:true
			},
			ng: {
				files: {
					'<%= project.ng.dist %>/<%= project.ng.combfile %>': [
					'<%= project.ng.src %>/angular.min.js'
					// ,
					// '<%= project.ng.src %>/angular-route.min.js'
					]
				}
			},
			js: {
				files: {
					'<%= project.js.dist %>/<%= project.js.combfile %>': [
					'<%= project.js.src %>/FileFilter.js',
					'<%= project.js.src %>/**/*Module.js',
					'<%= project.js.src %>/**/*.js',
					'!<%= project.js.src %>/worker/remote/**/*'

					]
				}
			},
			worker:{
				files: {
					'<%= project.worker.dist %>/<%= project.worker.combfile %>': [
					'<%= project.worker.src %>/file/FileModule.js',
					'<%= project.worker.src %>/filter/FilterModule.js',
					'<%= project.worker.src %>/worker/WorkerModule.js',
					'<%= project.worker.src %>/file/factory/ChunkMapper.js',
					'<%= project.worker.src %>/file/factory/Line.js',
					'<%= project.worker.src %>/file/service/FileReaderService.js',
					'<%= project.worker.src %>/filter/factory/FilterChunkProcessor.js',
					'<%= project.worker.src %>/worker/remote/**/*.js'
					]
				}
			},
			css : {
				files: {
				'<%= project.css.dist %>/<%= project.css.combfile %>': ['<%= project.css.src %>/**/*.css']
			  }
			}
		},
		uglify : {
			js:{
				options:{
					sourceMap:true,
					sourceMapIn:'<%= project.js.dist %>/<%= project.js.combfile %>.map'
				},
				files: {
					'<%= project.js.dist %>/<%= project.js.minfile %>': ['<%= project.js.dist %>/<%= project.js.combfile %>']
				}
			},
			worker:{
				options:{
					sourceMap:true,
					sourceMapIn:'<%= project.worker.dist %>/<%= project.worker.combfile %>.map'
				},
				files: {
					'<%= project.worker.dist %>/<%= project.worker.minfile %>': ['<%= project.worker.dist %>/<%= project.worker.combfile %>']
				}
			}
		},
		cssmin: {
		  options: {
		    shorthandCompacting: false,
		    roundingPrecision: -1,
		    sourceMap:true,
		    sourceMapIn:'<%= project.css.dist %>/<%= project.css.combfile %>.map'
		  },
		  css: {
		    files: {
		      '<%= project.css.dist %>/<%= project.css.minfile %>': ['<%= project.css.dist %>/<%= project.css.combfile %>']
		    }
		  }
		},

		htmlmin: {
    		html: {
      			options: {
       				removeComments: true,
        			collapseWhitespace: true
      			},
      			files: [
      				{
      					expand: true,
			          	src: '<%= project.html.src %>/**/*.htm',
			          	dest: '<%= project.html.dist %>',
			        },
			    ],
    		}
    	},

        clean: {
			options: { force: 'true' },
			all:{
				src:['<%= project.dist %>/**/*' ]
			},
			svg:{
				src:['<%= project.svg.dist %>/**/*.svg']
			},
			svgmin:{
				src:['<%= project.svg.dist %>/**/*.min.svg']
			},
            js: {
                src: ['<%= project.js.dist %>/**/*' ]
            },
            css: {
                src: ['<%= project.css.dist %>/**/*.css','<%= project.css.dist %>/**/*.css.map' ]
            },
            html: {
                src: ['<%= project.html.dist %>' ]
            }
        },

        svgmin: { //minimize SVG files
            options: {
                plugins: [
                    { removeViewBox: false },
                    { removeUselessStrokeAndFill: false },
                    { collapseGroups: false },
                    { removeUnknownsAndDefaults: false }
                ]
            },
            svg: {
                expand: true,
                cwd: '<%= project.svg.src %>',
                src: ['*.svg'],
                dest: '<%= project.svg.dist %>',
                ext: '.min.svg'
            }
        },

        svgstore : {
            options : {
            	prefix : 'icon-',
            	svg:{
            		style:"display: none;"
            	}
            },
            svg : {
            	files: {
                    '<%= project.svg.dist %>/svg-defs.comb.svg':  ['<%= project.svg.src %>/**/*.svg']
                  }
            }
        },
        watch:{
        	js:{
        		files: ['<%= project.js.src %>/**/*.js'],
                tasks: ['build-js']
        	},
        	svg:{
        		files:['<%= project.svg.src %>/**/*.svg'],
        		tasks: ['build-svg']
        	},
        	css:{
        		files:['<%= project.css.src %>/**/*.css'],
        		tasks: ['build-css']
        	},
        	html:{
        		files:['<%= project.html.src %>/**/*.htm'],
        		tasks: ['build-html']
        	}
        }
    });
	//std build tasks
    grunt.registerTask('build',['build-css','build-svg','build-js','build-html']);
    //grunt.registerTask('build-svg',['clean:svg','clean:svgmin','svgmin','svgstore']);
    grunt.registerTask('build-svg',['clean:svg','clean:svgmin','svgstore']);
	grunt.registerTask('build-js',['clean:js','concat:ng','concat:js','concat:worker','uglify:js','uglify:worker']);
	grunt.registerTask('build-css',['clean:css','concat:css','cssmin:css']);
	grunt.registerTask('build-html',['clean:html','htmlmin:html']);

	grunt.registerTask('default','runs build then watch and re-runs if there is a build issue', function(){
		grunt.task.run(['build','watch']);
	});
};


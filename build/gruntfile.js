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
			js :{
				src: '<%= project.basedir %>/javascript',
				dist:'<%= project.dist %>/javascript',
				combfile: 'FileFilter.comb.js',
				minfile: 'FileFilter.min.js'
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
			js: {
			  files: {
				'<%= project.js.dist %>/<%= project.js.combfile %>': [
				    '<%= project.js.src %>/FileFilter.js',
				    '<%= project.js.src %>/**/*Module.js',
				    '<%= project.js.src %>/**/*.js'
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
			options:{
				sourceMap:true,
				sourceMapIn:'<%= project.js.dist %>/<%= project.js.combfile %>.map'
			},
			js: {
		        files: {
		        	'<%= project.js.dist %>/<%= project.js.minfile %>': ['<%= project.js.dist %>/<%= project.js.combfile %>']
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
                    { removeUselessStrokeAndFill: true }
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
                    '<%= project.svg.dist %>/svg-defs.comb.min.svg':  ['<%= project.svg.dist %>/**/*.min.svg']
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
    grunt.registerTask('build-svg',['clean:svg','clean:svgmin','svgmin','svgstore']);
	grunt.registerTask('build-js',['clean:js','concat:js','uglify:js']);
	grunt.registerTask('build-css',['clean:css','concat:css','cssmin:css']);
	grunt.registerTask('build-html',['clean:html','htmlmin:html']);
	
	grunt.registerTask('dev','runs build then watch and re-runs if there is a build issue', function(){
		grunt.task.run(['build','watch']);
	});
};


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
				dist:'<%= project.dist %>/css'
			},
			js :{
				src: '<%= project.basedir %>/javascript',
				dist:'<%= project.dist %>/javascript',
				combfile: 'FileFilter.comb.js',
				minfile: 'FileFilter.min.js'
			},
			svg: {
				src:'<%= project.basedir %>/svg',
				dist:'<%= project.dist %>/svg'
			}
		},
		copy:{
			css:{
				files:[
					{expand: true, src: ['<%= project.css.src %>/**'], dest: '<%= project.css.dist %>/'}
				]
			},
			svg:{
				files:[
					{expand: true, src: ['<%= project.svg.src %>/**'], dest: '<%= project.svg.dist %>/'}
				]
			}
		},
		concat : {
			options: {
				separator: ';'
			},
			js: {
			  files: {
				'<%= project.js.dist %>/<%= project.js.combfile %>': [
				    '<%= project.js.src %>/FileFilter.js',
				    '<%= project.js.src %>/**/*Module.js',
				    '<%= project.js.src %>/**/*.js'
				    ]
			  }
			}
		},
		uglify : {
			js: {
		        files: {
		        	'<%= project.js.dist %>/<%= project.js.minfile %>': ['<%= project.js.dist %>/<%= project.js.combfile %>']
		        }
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
                src: ['<%= project.css.dist %>/**/*.css' ]
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
                    '<%= project.svg.dist %>/svg-defs.svg':  ['<%= project.svg.dist %>/**/*.min.svg']
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
        		tasks: ['copy:css']
        	}
        	
        }
    });
	//std build tasks 
    grunt.registerTask('build',['build-css','build-svg','build-js']);
    grunt.registerTask('build-svg',['clean:svg','svgmin','svgstore']);
	grunt.registerTask('build-js',['clean:js','concat:js','uglify:js']);
	grunt.registerTask('build-css',['clean:css','copy:css']);
	
	grunt.registerTask('dev','runs build then watch and re-runs if there is a build issue', function(){
		try{
			//grunt.task.run(['build']);
			grunt.task.run(['build','watch']);
		}catch(error){
			//if there is an error run again in 10 seconds. 
			setTimeout(watchCatcher, 10000);
		}
	});
};


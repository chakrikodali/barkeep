module.exports = function(grunt) {
	"use strict";
	var path = require('path');

	grunt.registerMultiTask('templates', 'Constructs a json from list of html files and minifies the json', function() {
      	var outputJSON = {};
      	
      	this.files.forEach(function(f) {
        	f.src.filter(function(filepath) {
		        // Warn on and remove invalid source files (if nonull was set).
		        if (!grunt.file.exists(filepath)) {
		          	grunt.log.warn('Source file "' + filepath + '" not found.');
		          	return false;
		        } else {
		          	return true;
		        }
		    }).map(function(filepath) {
		    	outputJSON[path.basename(filepath, '.html')] = grunt.file.read(filepath)
		    });

		    //write output json to destination file
		    grunt.file.write(f.dest, JSON.stringify(outputJSON));
        });

	});
};
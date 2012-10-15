/*
 * grunt-barkeep
 * https://github.com/flite/barkeep
 *
 * Copyright (c) 2012 Flite, Inc.
 * Licensed under the MIT license.
 */
 
module.exports = function(grunt) {
    var Snockets = require('snockets');
    var path = require('path');
    
    grunt.registerHelper('output-filename', function(filename, config) {
        var extension = path.extname(filename);
        var newFilename = filename.replace(extension, '.' + config.destExtension);
        // Place in a different directory.
        if (config.destDir) {
            return config.preservePath ? path.join(config.destDir, newFilename) :
                path.join(config.destDir, path.basename(newFilename));
        }
        return newFilename;
    });
    
    grunt.registerHelper('header-footer', function(sources, config) {
        if (config.header) {
           sources.unshift(config.header);
        }
        if (config.footer) {
           sources.push(config.footer);
        }
    });
    
    // ## snockets task
    // Generate a dependency tree using snockets for the concat and min tasks.
    grunt.registerMultiTask('snockets', 'Create snockets dependency tree for concat and min.', function() {
        var done = this.async(), task = this;
        var snock = new Snockets();
        
        // Make sure a configuration object exists if there is not destination.
        if (!task.file.dest && !task.data.options) {
            grunt.warn(task.nameArgs + ' requires an options object or a dest object.');
        }
        
        // Get options
        var options = task.data.options, 
            config = {concat: {}, min: {}};
        var enableMinification = options.min && options.min.enabled !== false;
        
        // Use snockets to get the dependency chain files.
        var js = grunt.file.expandFiles(task.file.src);
        grunt.utils.async.forEach(js, function (fn, callback) {
            snock.getCompiledChain(fn, function (err, jsList) {
                if (err) {
                    grunt.fail.fatal(err);
                }
                if (!jsList) {
                    callback(null);
                }
                // Add to config.concat object.
                config.concat[fn] = {
                    src: grunt.utils._.pluck(jsList, 'filename'),
                    dest: task.file.dest || grunt.helper('output-filename', fn, options.concat)
                };
                grunt.helper('header-footer', config.concat[fn].src, options.concat);
                
                // Add to config.min object (if enabled)
                if (enableMinification) {
                    config.min[fn] = {
                        src: config.concat[fn].dest,
                        dest: grunt.helper('output-filename', fn, options.min)
                    };
                    grunt.helper('header-footer', config.min[fn].src, options.min);
                }
                callback(null);
            });
        }, function(err) {
            if (err) {
                return done(err);
            }
            grunt.verbose.writeln('concat tree'.underline);
            grunt.verbose.writeln(require('util').inspect(config.concat));
            grunt.verbose.writeln('min tree'.underline);
            grunt.verbose.writeln(require('util').inspect(config.min));
            
            var existingConcat = grunt.config.get('concat') || {};
            var existingMin = grunt.config.get('min') || {};
            grunt.utils._.extend(existingConcat, config.concat);
            grunt.utils._.extend(existingMin, config.min);
            // Refresh concat and min config
            grunt.config.set('concat', existingConcat);
            grunt.config.set('min', existingMin);
            done();
        });
    });
};
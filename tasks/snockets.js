/*
 * grunt-barkeep
 * https://github.com/flite/barkeep
 *
 * Copyright (c) 2012 Flite, Inc.
 * Licensed under the MIT license.
 */
 
module.exports = function(grunt) {
    "use strict";
    var Snockets = require('snockets');
    var path = require('path');
    
    var outputFilename = exports.outputFilename = function(filename, config) {
        var extension = path.extname(filename);
        var newFilename = filename.replace(extension, '.' + config.destExtension);
        // Place in a different directory.
        if (config.destDir) {
            return config.preservePath ? path.join(config.destDir, newFilename) :
                path.join(config.destDir, path.basename(newFilename));
        }
        return newFilename;
    };
    
    // Add header and footer.
    var headerFooter = exports.headerFooter = function(source, config) {
        if (config.header) {
           source = config.header + source;
        }
        if (config.footer) {
           source = source + config.footer;
        }
        return source;
    };
    
    // ## snockets task
    // Generate a dependency tree using snockets for the concat and min tasks.
    grunt.registerMultiTask('snockets', 'Create snockets dependency tree for concat and min.', function() {
        var done = this.async(), task = this;
        var snock = new Snockets();

        // Get options
        var options = task.options();
        // Make sure a configuration object exists if there is not destination.
        if (!options) {
            grunt.warn('Requires an options object.');
        }
        
        // Use snockets to get the dependency chain files.
        var js = task.filesSrc;
        grunt.util.async.forEach(js, function (fn, callback) {
            snock.getConcatenation(fn, {minify: options.minify}, function (err, js) {
                if (err) {
                    grunt.fail.fatal(err);
                }
                var combinedFile = outputFilename(fn, options);
                var javascript  = headerFooter(js, options);
                
                grunt.file.write(combinedFile, javascript);

                callback(null);
            });
        }, function(err) {
            if (err) {
                return done(err);
            }
            done();
        });
    });
};

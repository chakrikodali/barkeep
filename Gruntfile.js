module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    meta: {
      ducksboard_api_key: 'foo.bar'
    },
    snockets: {
      test: {
          src: ['test/fixtures/b.js'],
          options: {
              concat: {
                 destExtension: "debug.js",
                 destDir: "target"
              },
              min: {
                 destExtension: "min.js"
              }
          }
      },
      coffee: {
        src: ['test/fixtures/first.coffee'],
        options: {
            concat: {
              destExtension: "debug.coffee",
              destDir: 'target'
            }
        }
      }
    },
    deploy: {
        aws_key: 'key',
        aws_secret: 'secret',
        aws_bucket: 'bucket',
        bucketDir: 'scripts',
        srcDir: 'tasks',
        src: ['tasks/*.js']
    },
    jshint: {
      files: ['grunt.js', 'tasks/**/*.js', 'test/**/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        es5: true
      },
    },
    nodeunit: {
      files: ['test/s3.js']
    },
    ducksboard: {
        tasks: {
            src: ['tasks/*.js'],
            endpoint: 'foo.bar'
        }
    },
    templates: {
      first: {
        src: ['test/fixtures/html/one.html', 'test/fixtures/html/two.html'],
        dest: 'test/fixtures/html/templateJSON1.js',
        options: {
          templatesName: 'window.TemplatesNamespace.first'
        }
      },
      second: {
        src: ['test/fixtures/html/three.html', 'test/fixtures/html/one.html'],
        dest: 'test/fixtures/html/templateJSON2.js',
        options: {
          templatesName: 'window.TemplatesNamespace.second'
        }
      }
    }
  });
  
  // Load grunt s3
  grunt.loadNpmTasks('grunt-s3');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Load local tasks.
  grunt.loadTasks('tasks');
  
  // Default task.
  grunt.registerTask('test', ['nodeunit']);
  grunt.registerTask('default', 'jshint');
};

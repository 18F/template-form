// Gruntfile.js

// our wrapper function (required by grunt and its plugins)
// all configuration goes inside this function
module.exports = function(grunt) {

  // ===========================================================================
  // CONFIGURE GRUNT ===========================================================
  // ===========================================================================
  grunt.initConfig({

    // get the configuration info from package.json ----------------------------
    // this way we can use things like name and version (pkg.name)
    pkg: grunt.file.readJSON('package.json'),

    // all of our configuration will go here
    jshint: {
      options: {
        reporter: require('jshint-stylish') // use jshint-stylish to make our errors look and read good
      },

      // when this task is run, lint the Gruntfile and all js files in src
      build: ['Gruntfile.js', 'src/**/*.js']
    },
    browserify: {
      'dist/js/bundle.js': ['src/form.js']
    },
    uglify: {
      options: {
        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
      },
      dist: {
        files: {
          'dist/js/script.min.js': 'compile/bundle.js'
        }
      }
    },
    template: {
                build: {
                    'options': {
                        'data': {
                          jsFile: 'bundle'
                        }
                    },
                    'files': {
                        'dist/index.html': ['src/index.html']
                    }
                },
                dist: {
                  'options': {
                      'data': {
                        jsFile: 'script.min'
                      }
                  },
                  'files': {
                      'dist/index.html': ['src/index.html']
                  }
                }
            },
    copy: {
      build: {
        files: [
          // includes files within path


          // includes files within path and its sub-directories
          {expand: true, src: ['./node_modules/bootstrap/dist/css/bootstrap.min.css'], dest: 'dist/css/', flatten: true},
        ],
      },
    },

    watch: {
      scripts: {
        files: 'src/**/*.js',
        tasks: ['jshint', 'browserify']
      },
      indexFile: {
        files: 'src/*.html',
        tasks: ['copy']
      }

    }


  });

  // ===========================================================================
  // LOAD GRUNT PLUGINS ========================================================
  // ===========================================================================
  // we can only load these if they are in our package.json
  // make sure you have run npm install so our app can find these
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-fixmyjs');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-template');

  // ========= // CREATE TASKS =========

// this default task will go through all configuration (dev and production) in each task
grunt.registerTask('default', ['jshint', 'browserify', 'template', 'copy']);
grunt.registerTask('dist', ['jshint', 'browserify', 'uglify', 'template:dist', 'copy']);
};

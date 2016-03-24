
module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    options: { debug: false },
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      app: {
        src: ['app/app.js'],
        dest: 'static/build/app.js',
        options: {
          browserifyOptions: {
            debug: true,
            standalone: 'app'
          },
          paths: ['./node_modules','./app'],
          transform: ["babelify"]
        }
      }
    },
    uglify: {
      options: {
        sourceMap: true,
        sourceMapIncludeSources: true
      },
      app: {
        src: 'static/build/app.js',
        dest: 'static/build/app.js'
      }
    },
    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'static/build/main.css': 'scss/main.scss'
        }
      }
    },
    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')({ browsers: ['last 2 versions'] })
        ]
      },
      dist: {
        src: 'static/build/*.css'
      }
    },
    nodemon: {
      dev: {
        script: 'index.js',
        cwd: __dirname,
        options: {
          env: {
            DEBUG: 'supermoon:*',
            NODE_ENV: 'development',
            PORT: '3000',
            HEALTH_CHECK: false
          }
        }
      }
    },
    concurrent: {
      dev: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    watch: {
      app: {
        files: ['app/**/*.js'],
        tasks: ['browserify'],
        options: {
          spawn: false,
        }
      },
      sass: {
        files: ['scss/**/*.scss'],
        tasks: ['sass', 'postcss'],
        options: {
          spawn: false
        }
      }
    }
  });

  grunt.registerTask('default', []);
  grunt.registerTask('build', ['browserify', 'uglify', 'sass', 'postcss']);
  grunt.registerTask('develop', ['browserify', 'sass', 'concurrent:dev']);

};

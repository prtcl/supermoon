
module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        options: { debug: false },
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            app: {
                src: ['app/client.js'],
                dest: 'static/build/client.js',
                options: {
                    paths: ['./node_modules','./app'],
                    browserifyOptions: {
                        debug: true
                    }
                }
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
        nodemon: {
            dev: {
                script: 'index.js'
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
                tasks: ['build'],
                options: {
                    spawn: false,
                }
            },
            sass: {
                files: ['scss/**/*.scss'],
                tasks: ['build'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.registerTask('default', []);
    grunt.registerTask('build', ['browserify', 'sass']);
    grunt.registerTask('develop', ['browserify', 'sass', 'concurrent:dev']);

};

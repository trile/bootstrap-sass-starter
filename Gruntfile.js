module.exports = function(grunt) {

    grunt.initConfig({
        //copy source from Bootstrap folder in node_modules to app
        copy: {
            bootstrap_sass: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['node_modules/bootstrap/scss/*'],
                        dest: 'app/scss/vendors/bootstrap'
                    }, {
                        expand: true,
                        flatten: true,
                        src: ['node_modules/bootstrap/scss/mixins/*'],
                        dest: 'app/scss/vendors/bootstrap/mixins'
                    }, {
                        expand: true,
                        flatten: true,
                        src: ['node_modules/bootstrap/scss/utilities/*'],
                        dest: 'app/scss/vendors/bootstrap/utilities'
                    }
                ]
            },
            font_awesome: {
                expand: true,
                flatten: true,
                src: ['node_modules/font-awesome/scss/*'],
                dest: 'app/scss/vendors/font-awesome'
            },
            bootstrap_dist: {
                expand: true,
                flatten: true,
                src: ['node_modules/bootstrap/dist/css/bootstrap.min.*'],
                dest: 'app/css/'
            },
            jquery: {
                expand: true,
                flatten: true,
                src: ['node_modules/jquery/dist/jquery.min.*'],
                dest: 'app/js/'
            },
            bootstrap_js: {
                expand: true,
                flatten: true,
                src: ['node_modules/bootstrap/dist/js/bootstrap.min.js'],
                dest: 'app/js/'
            }


        },

        // Clean up before actions
        clean: {
            reset: {
                src: [
                    'app/css/main.css',
                    'app/css/main.min.css',
                    'app/css/main.css.map',
                    'app/css/main.min.css.map',
                    'app/js/jquery.min.*',
                    'app/js/bootstrap.min.*',
                    'app/less/vendors'
                ]
            },
            development: {
                src: ['app/css/main.css', 'app/css/main.min.css']
            },
            dist: {
                src: ['app/css/main.css', 'app/css/main.min.css']
            }
        },

        // Compile less file
        sass: {
            development: {
                options: {
                    sourceMap: true
                },
                files: {
                    'app/css/main.css': 'app/scss/main.scss'
                }
            },
            dist: {
                options: {
                    sourceMap: true
                },
                files: {
                    "app/css/main.css": "app/scss/main.scss"
                }
            }
        },

        // Auto prefix for browser
        autoprefixer: {
            options: {
                // map: true,
                browsers: [
                    "Android 2.3",
                    "Android >= 4",
                    "Chrome >= 20",
                    "Firefox >= 24",
                    "Explorer >= 8",
                    "iOS >= 6",
                    "Opera >= 12",
                    "Safari >= 6"
                ]
            },
            development: {
                expand: true,
                cwd: 'app/css',
                src: ['*.css'],
                dest: 'app/css'
            }
        },

        // Set up proper format for css files
        csscomb: {
            options: {
                config: 'app/less/.csscomb.json'
            },
            development: {
                expand: true,
                cwd: 'app/css/',
                src: [
                    '*.css', '!*.min.css'
                ],
                dest: 'app/css/'
            }
        },

        ejs: {
            development: {
                src: [
                    'app/ejs/**/*.ejs', '!app/ejs/partials/**/*'
                ],
                dest: 'app',
                expand: true,
                flatten: true,
                ext: '.html'
            }
        },

        // Minimize CSS files
        cssmin: {
            development: {
                src: ['app/css/main.css'],
                dest: 'app/css/main.min.css'
            },
            dist: {
                options: {
                    // TODO: disable `zeroUnits` optimization once clean-css 3.2 is released
                    //    and then simplify the fix for https://github.com/twbs/bootstrap/issues/14837 accordingly
                    compatibility: 'ie8',
                    keepSpecialComments: '*',
                    sourceMap: true,
                    sourceMapInlineSources: true,
                    advanced: false
                },
                src: ['app/css/main.css'],
                dest: 'app/css/main.min.css'
            }

        },

        //Optimize JS files
        // uglify: {
        //   dist: {
        //     options: {
        //       mangle: false
        //     },
        //     files: {
        //       'app/js/main.js': [ 'app/js/*.js' ]
        //     }
        //   }
        // },

        // Setup local server for development
        connect: {
            options: {
                port: 8080,
                livereload: 42201,
                base: 'app',
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true
                }
            }
        },

        // Watch files to rerun workflow and use live reload to refresh browser
        watch: {
            sass: {
                files: ['app/scss/**/*.scss'],
                tasks: ['sass:development', 'autoprefixer', 'csscomb', 'cssmin:development']
            },
            ejs: {
              files: ['app/ejs/**/*.ejs', '!app/ejs/partials/**/*'],
              tasks: ['ejs:development']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: ['{,*/}*.html', 'app/css/{,*/}*.css', 'app/js/{,*/}*.js']
            }
        }

    });

    // define the tasks
    grunt.registerTask('setup-sass', [
        'clean:reset',
        'copy:bootstrap_sass',
        'copy:font_awesome',
        'copy:bootstrap_js',
        'copy:jquery'
    ]);
    grunt.registerTask('setup-external-bs', ['clean:reset', 'copy:bootstrap_dist', 'copy:bootstrap_js', 'copy:jquery']);
    grunt.registerTask('dev-compile', ['sass:development', 'autoprefixer', 'csscomb', 'cssmin:development']);
    grunt.registerTask('dist', ['clean:dist', 'sass:dist', 'autoprefixer', 'csscomb', 'cssmin:dist']);
    grunt.registerTask('test', ['clean:dist', 'sass:dist', 'autoprefixer', 'csscomb', 'cssmin:dist']);
    grunt.registerTask('server', [
        'ejs:development',
        'sass:development',
        'autoprefixer',
        'csscomb',
        'cssmin:development',
        'connect:livereload',
        'watch'
    ]);

    // load the tasks
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-csscomb');
    grunt.loadNpmTasks('grunt-ejs');
};

/*global module:false*/
module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>; */\n',
    // Task configuration.
    modernizr:{
      dist: {
        // [REQUIRED] Path to the build you're using for development. 
        "devFile" : "components/modernizr/modernizr.js",
        // Path to save out the built file. 
        "outputFile" : "js/modernizr-custom.min.js"
      },
      dev:{
        // [REQUIRED] Path to the build you're using for development. 
        "devFile" : "components/modernizr/modernizr.js",
        // Path to save out the built file. 
        "outputFile" : "js/modernizr-custom.js"
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: false,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true,
          $: true,
          console: true,
          alert: true,
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      js_source: {
        src: ['js-source/**/*.js']
      }
    },

    concat: {
      dist:{
        options: {
          banner: '<%= banner %>',
          stripBanners: true
        },
        files:{
          'js/utils.min.js' : ['js/modernizr-custom.min.js', 'components/jquery/dist/jquery.min.js', 'components/foundation/js/foundation.min.js']
        }
      },
      dev: {
        options: {
          banner: '<%= banner %>',
          stripBanners: true
        },
        files: {
          'js/utils.js' : ['js/modernizr-custom.js', 'components/jquery/dist/jquery.js', 'components/foundation/js/foundation.js']
        }
      }
    },

    copy:{
      jquerymap: {
        src: 'components/jquery/dist/jquery.min.map',
        dest: 'js/jquery.min.map'
       }//,
      // iconos: {
      //   files: [{
      //     expand: true,
      //     cwd: 'media/iconos/icomoon/',
      //     src: ['**'],
      //     dest: 'css/iconos/'
      //   }]
      // }
    },

    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      modernizr: {
        src: 'components/modernizr/modernizr.js',
        dest: 'components/modernizr/modernizr.min.js'
      },
      js_source: {
        files: [
          {
            src: 'js-source/site.js',
            dest: 'js/site.min.js'
          },{
            src: 'js-source/modernizr-tests.js',
            dest: 'js/modernizr-tests.min.js'
          }
        ]
      }
    },

    compass: {
      dist: {
        options: {
          sassDir: 'css-scss',
          cssDir: 'css',
          outputStyle: 'compressed'
        }
      },
      dev: {
        options: {
          sassDir: 'css-scss',
          cssDir: 'css',
          outputStyle: 'expanded'
        }
      }
    },
    watch: {
        gruntfile_dist: {
          files: '<%= jshint.gruntfile.src %>',
          tasks: ['jshint:gruntfile']
        }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks("grunt-modernizr");
  var env = grunt.option('env') || 'dev';
  // Default task.
  if(env === "dev"){
    grunt.registerTask('default', ['modernizr:dev','jshint', 'concat:dev','copy', 'compass:dev', 'watch']);
    grunt.config.merge({
      copy:{
        dev:{
          files : [
          {
            expand : true,
            dest   : 'js',
            cwd    : 'js-source',
            src    : [
              '**/*.js', '!home.js'
            ]
          }
        ]
        }
      },
      watch: {
        js_source: {
          files: '<%= jshint.js_source.src %>',
          tasks: ['jshint:js_source', 'concat:dev', 'copy:dev']
        },
        css_source: {
          files: '<%= compass.dist.options.sassDir %>/**/*.scss',
          tasks: ['compass:dev']
        }
      }
    });
  }else if(env === "prod"){
    grunt.registerTask('default', ['modernizr:dist','jshint', 'concat:dist','copy', 'uglify', 'compass:dist', 'watch']);
    grunt.config.merge({
      watch: {
        js_source_dist: {
          files: '<%= jshint.js_source.src %>',
          tasks: ['jshint:js_source', 'concat:dist', 'uglify:js_source']
        },
        css_source_dist: {
          files: '<%= compass.dist.options.sassDir %>/**/*.scss',
          tasks: ['compass:dist']
        }
      }
    });
  }
  

};

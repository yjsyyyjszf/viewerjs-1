/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

    // Custome Paths
    srcFiles: ['src/js/viewerjs.js'], // source files (order here is important for dependencies)
    testFiles: ['spec/*.spec.js'], // test files (jasmin' specs)
    libDir: 'src/js/lib', // libraries that cannot be installed through bower
    componentsDir: 'src/js/components', // bower components

    // Task configuration.
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
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true, $: true, viewerjs: true, X: true, dicomParser: true, console: true,
          alert: true, require: true, describe: true, it: true, expect: true, define: true
        }
      },
      source: {
        src: '<%= srcFiles %>'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      test: {
        src: '<%= testFiles %>'
      }
    },

    jasmine: {
      test: {
        //src: '<%= jshint.source.src %>', this line must beommented when using the define function within the specs files
        options: {
          specs: '<%= jshint.test.src %>',
          template: require('grunt-template-jasmine-requirejs'),
          templateOptions: {
            version: '<%= componentsDir %>/requirejs/require.js',
            requireConfigFile: 'src/main.js', // requireJS's config file
            requireConfig: {
              baseUrl: 'src/js/components' // change base url to execute tests from local FS
            }
          }
        }
      }
    },

    requirejs: {
      compile: {
        options: {
          baseUrl: 'src/js/components',
          paths: {
            jquery: 'empty:',
            jquery_ui: 'empty:'
          },
          name: 'viewerjs',
          mainConfigFile: 'src/main.js',
          out: 'dist/js/<%= pkg.name %>.min.js'
        }
      }
    },

    copy: {
      /*html: {
        src: 'src/index.html',
        dest: 'dist/index.html',
      },*/
      styles: {
        files: [{expand: true, cwd: 'src/', src: ['styles/**'], dest: 'dist/'}]
      },
    /*  images: {
        files: [{expand: true, cwd: 'src/', src: ['images/**'], dest: 'dist/'}]
      },*/
    /*  config: {
        src: 'src/config_built.js',
        dest: 'dist/main.js',
      },*/
  /*    libs: { // copy requiered libs which were not concatenated

  },*/
      components: { // copy requiered bower components which were not concatenated
        files: [
          { expand: true,
            cwd: '<%= componentsDir %>',
            src: ['requirejs/require.js', 'jquery/dist/jquery.min.js',
              'jquery-ui/jquery-ui.min.js', 'jquery-ui/themes/smoothness/**'],
            dest: 'dist/js/components' }]
      },
    },

    watch: {
      source: {
        files: '<%= jshint.source.src %>',
        tasks: ['jshint:source']
      },
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'jasmine']
      }
    }

  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  // Test task.
  grunt.registerTask('test', ['jshint', 'jasmine']);
  // Build task.
  grunt.registerTask('build', ['jshint', 'jasmine', 'requirejs', 'copy']);
  // Default task.
  grunt.registerTask('default', ['build']);

};

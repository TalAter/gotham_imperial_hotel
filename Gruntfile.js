module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: [
        'js/app.js',
        'Gruntfile.js'
      ],
      options: {
        jshintrc: true
      }
    },
    watch: {
      files: ['js/**', 'index.html', '!**/node_modules/**'],
      tasks: ['default']
    },
    connect: {
      server: {
        options: {
          protocol: 'http',
          port: 8443,
          hostname: '*',
          base: '.',
          open: 'http://localhost:8443/index.html'
        }
      }
    }
  });

  // Load NPM Tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Register task(s).
  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('serve', ['default', 'connect', 'watch']);
};

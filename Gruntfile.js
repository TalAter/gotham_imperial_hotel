module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: [
        'public/js/app.js',
        'Gruntfile.js'
      ],
      options: {
        jshintrc: true
      }
    },
    watch: {
      files: ['public/**/*', '!**/node_modules/**'],
      tasks: ['default']
    },
    express: {
      web: {
        options: {
          script: 'server/index.js',
          port: 8443
        }
      }
    }
  });

  // Load NPM Tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');

  // Register task(s).
  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('serve', ['default', 'express', 'watch']);
};

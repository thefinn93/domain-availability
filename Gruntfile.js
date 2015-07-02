module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      vendor: {
        files: [
          {
            expand: true, cwd: 'node_modules/jquery/dist/',
            src: ['jquery.min.js', 'jquery.min.map'], dest: 'public/vendor/jquery/'
          }
        ]
      }
    },
    watch: {
      serverJS: {
         files: ['**.js'],
         tasks: ['jshint']
      },
    },
    jshint: {
      files: ['**.js']
    },
    nodemon: {
      dev: {
        script: 'bin/www'
      }
    },
    concurrent: {
      dev: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  grunt.registerTask('default', ['copy', 'concurrent']);

};

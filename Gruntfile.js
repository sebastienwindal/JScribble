module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    /**
     * generate plato report in plato-report subfolder
     */
    plato: {
        options: {
            // Task-specific options go here.
        },
        your_target: {
                // Target-specific file lists and/or options go here.
            files: {
                 'plato-report': ['public/js/*.js']
            }
        },
    },
        
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-plato');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};
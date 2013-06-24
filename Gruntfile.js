module.exports = function(grunt) {

  grunt
      .initConfig({
        clean: {
          build: ["target"]
        },
        connect : {
          server : {
            options : {
              port : 8000,
              base : 'src'
            }
          }
        },
        qunit : {
          all : {
            options : {
              urls : ['http://localhost:8000/test/qunit/index.html']
            }
          }
        },
        shell : {
          firefox : {
            command : [
                'mvn test -DWebDriver=FirefoxDriver'
                ].join('&&')
          },
          chrome : {
            command : [
                'mvn test -DWebDriver=ChromeDriver'
                ].join('&&')
          },
          phantom : {
            command : [
                'mvn test -DWebDriver=PhantomJSDriver'
                ].join('&&'),
          },
          ie : {
            command : [
                'mvn test -DWebDriver=InternetExplorerDriver'
                ].join('&&'),
          },
          safari : {
            command : [
                'mvn test -DWebDriver=SafariDriver'
                ].join('&&'),
          }
        }
      });

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('it', ['clean', 'connect', 'shell:phantom', 'shell:chrome', 'shell:firefox']);
  grunt.registerTask('all', ['clean', 'connect', 'shell']);
  grunt.registerTask('default', ['clean', 'connect', 'qunit']);

};
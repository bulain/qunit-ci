module.exports = function(grunt) {

  grunt
      .initConfig({
        env : {
          baseUrl : 'http://localhost:'+ (grunt.option('port')||8000),
          port : grunt.option('port')||8000
        },
        clean: {
          build: ["target"]
        },
        connect : {
          server : {
            options : {
              port : '<%=env.port%>',
              base : 'src'
            }
          }
        },
        qunit : {
          all : {
            options : {
              urls : ['<%=env.baseUrl%>/test/qunit/index.html']
            }
          }
        },
        shell : {
          firefox : {
            command : [
                'mvn test -DWebDriver=FirefoxDriver -DBaseUrl=<%=env.baseUrl%>'
                ].join('&&')
          },
          chrome : {
            command : [
                'mvn test -DWebDriver=ChromeDriver -DBaseUrl=<%=env.baseUrl%>'
                ].join('&&')
          },
          phantom : {
            command : [
                'mvn test -DWebDriver=PhantomJSDriver -DBaseUrl=<%=env.baseUrl%>'
                ].join('&&'),
          },
          ie : {
            command : [
                'mvn test -DWebDriver=InternetExplorerDriver -DBaseUrl=<%=env.baseUrl%>'
                ].join('&&'),
          },
          safari : {
            command : [
                'mvn test -DWebDriver=SafariDriver -DBaseUrl=<%=env.baseUrl%>'
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
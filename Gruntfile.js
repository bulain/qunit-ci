module.exports = function(grunt) {

  grunt.initConfig({
      env : {
        baseUrl : 'http://localhost:' + (grunt.option('port') || 8000),
        port : grunt.option('port') || 8000,
        seleniumPort : grunt.option('seleniumPort') || 4444,
        reportsDir: 'target/surefire-reports',
        qunitJson : process.cwd()+'/src/test/resources/qunit.json',
      },
      clean: {
        build: ["target"]
      },
      'curl-dir': {
        long:{
          src: [
            'https://selenium.googlecode.com/files/selenium-server-standalone-2.35.0.jar'
          ],
          dest: 'node_modules/.bin'
        }
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
      webdriver_startup: {
        options : {
          port: '<%=env.seleniumPort%>',
        }
      },
      webdriver_qunit: {
        options: {
          reportsDir: '<%=env.reportsDir%>',
          qunitJson: '<%=env.qunitJson%>',
          baseUrl: '<%=env.baseUrl%>',
        },
        phantomjs: {
          options: {
            browserNames: ['phantomjs'],
          }
        },
        linux: {
          options: {
            browserNames: ['phantomjs', 'chrome', 'firefox'],
          }
        },
        windows: {
          options: {
            browserNames: ['phantomjs', 'chrome', 'firefox', 'ie', 'safari'],
          }
        },
      },
    });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-webdriver-qunit');
  grunt.loadNpmTasks('grunt-curl');

  grunt.registerTask('default', ['clean', 'connect', 'qunit']);
  grunt.registerTask('test', ['clean', 'connect', 'webdriver_startup', 'webdriver_qunit:linux']);
  grunt.registerTask('all', ['clean', 'connect', 'qunit', 'webdriver_startup', 'webdriver_qunit:windows']);

};
module.exports = function(grunt) {

  grunt.initConfig({
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
      webdriver_startup: {
        options : {
          port: '4444',
        }
      },
      webdriver_qunit: {
        phantomjs: {
          options: {
            browserName: 'phantomjs',
            reportsDir: 'target/surefire-reports',
            qunitJson: process.cwd()+'/src/test/resources/qunit.node.json',
            baseUrl: 'http://localhost:8000',
          }
        },
        chrome: {
          options: {
            browserName: 'chrome',
            reportsDir: 'target/surefire-reports',
            qunitJson: process.cwd()+'/src/test/resources/qunit.node.json',
            baseUrl: 'http://localhost:8000',
          }
        },
        firefox: {
          options: {
            browserName: 'firefox',
            reportsDir: 'target/surefire-reports',
            qunitJson: process.cwd()+'/src/test/resources/qunit.node.json',
            baseUrl: 'http://localhost:8000',
          }
        },
        ie: {
          options: {
            browserName: 'ie',
            reportsDir: 'target/surefire-reports',
            qunitJson: process.cwd()+'/src/test/resources/qunit.node.json',
            baseUrl: 'http://localhost:8000',
          }
        },
        safari: {
          options: {
            browserName: 'safari',
            reportsDir: 'target/surefire-reports',
            qunitJson: process.cwd()+'/src/test/resources/qunit.node.json',
            baseUrl: 'http://localhost:8000',
          }
        },
      },
    });

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-webdriver-qunit');

  grunt.registerTask('webdriver_linux', ['webdriver_qunit:phantomjs', 'webdriver_qunit:chrome', 'webdriver_qunit:firefox']);
  grunt.registerTask('webdriver_windows', ['webdriver_qunit:phantomjs', 'webdriver_qunit:chrome', 'webdriver_qunit:firefox', 'webdriver_qunit:ie', 'webdriver_qunit:safari']);
  grunt.registerTask('test_linux', ['clean', 'connect', 'webdriver_startup', 'webdriver_linux']);
  grunt.registerTask('test_windows', ['clean', 'connect', 'webdriver_startup', 'webdriver_windows']);
  grunt.registerTask('test', ['test_linux']);
  grunt.registerTask('default', ['clean', 'connect', 'qunit']);

};
module.exports = function(grunt) {

  grunt.initConfig({
      env : {
        baseUrl : 'http://localhost:' + (grunt.option('port') || 8000),
        port : grunt.option('port') || 8000,
        seleniumPort : grunt.option('seleniumPort') || 4444,
        reportsDir: 'target/surefire-reports',
        qunitJson : process.cwd()+'/src/test/resources/qunit.node.json',
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
          port: '<%=env.seleniumPort%>',
        }
      },
      webdriver_qunit: {
        phantomjs: {
          options: {
            browserName: 'phantomjs',
            reportsDir: '<%=env.reportsDir%>',
            qunitJson: '<%=env.qunitJson%>',
            baseUrl: '<%=env.baseUrl%>',
          }
        },
        chrome: {
          options: {
            browserName: 'chrome',
            reportsDir: '<%=env.reportsDir%>',
            qunitJson: '<%=env.qunitJson%>',
            baseUrl: '<%=env.baseUrl%>',
          }
        },
        firefox: {
          options: {
            browserName: 'firefox',
            reportsDir: '<%=env.reportsDir%>',
            qunitJson: '<%=env.qunitJson%>',
            baseUrl: '<%=env.baseUrl%>',
          }
        },
        ie: {
          options: {
            browserName: 'ie',
            reportsDir: '<%=env.reportsDir%>',
            qunitJson: '<%=env.qunitJson%>',
            baseUrl: '<%=env.baseUrl%>',
          }
        },
        safari: {
          options: {
            browserName: 'safari',
            reportsDir: '<%=env.reportsDir%>',
            qunitJson: '<%=env.qunitJson%>',
            baseUrl: '<%=env.baseUrl%>',
          }
        },
      },
    });

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-webdriver-qunit');

  grunt.registerTask('default', ['clean', 'connect', 'qunit']);
  grunt.registerTask('linux', ['webdriver_startup', 'webdriver_qunit:phantomjs', 'webdriver_qunit:chrome', 'webdriver_qunit:firefox']);
  grunt.registerTask('windows', ['webdriver_startup', 'webdriver_qunit:phantomjs', 'webdriver_qunit:chrome', 'webdriver_qunit:firefox', 'webdriver_qunit:ie', 'webdriver_qunit:safari']);
  grunt.registerTask('test', ['clean', 'connect', 'linux']);
  grunt.registerTask('all', ['clean', 'connect', 'qunit', 'windows']);

};
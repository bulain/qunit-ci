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
            browserNames: ['phantomjs'],
            reportsDir: '<%=env.reportsDir%>',
            qunitJson: '<%=env.qunitJson%>',
            baseUrl: '<%=env.baseUrl%>',
          }
        },
        linux: {
          options: {
            browserNames: ['phantomjs', 'chrome', 'firefox'],
            reportsDir: '<%=env.reportsDir%>',
            qunitJson: '<%=env.qunitJson%>',
            baseUrl: '<%=env.baseUrl%>',
          }
        },
        windows: {
          options: {
            browserNames: ['phantomjs', 'chrome', 'firefox', 'ie', 'safari'],
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
  grunt.registerTask('test', ['clean', 'connect', 'webdriver_startup', 'webdriver_qunit:linux']);
  grunt.registerTask('all', ['clean', 'connect', 'qunit', 'webdriver_startup', 'webdriver_qunit:windows']);

};
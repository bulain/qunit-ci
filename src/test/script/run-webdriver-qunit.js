var async = require('async');
var should = require('should');
var webdriver = require('selenium-webdriver');
var remote = require('selenium-webdriver/remote');
var test = require('selenium-webdriver/testing');
var fs = require('fs');

test.describe('#selenium-webdriver', function() {
  var driver, server, browserName = 'phantomjs';// firefox, chrome, phantomjs

  test.before(function() {
    server = new remote.SeleniumServer({
      jar : 'node_modules/webdriverjs/bin/selenium-server-standalone-2.31.0.jar',
      port : 4444
    });
    server.start();

    driver = new webdriver.Builder().usingServer(server.address()).withCapabilities({
      'browserName' : browserName
    }).build();
  });
  test.after(function() {
    driver.quit();
    server.stop();
  });
  var testSingle = function(baseUrl, path) {
    driver.get(baseUrl + path);
    var By = webdriver.By;
    var attrName = 'ie' === browserName ? 'innerHTML' : 'textContent';
    var textContent = '';
    var bool = true;

    async.whilst(function() {
      return textContent.indexOf('completed') < 0;
    }, function(cb) {
      driver.findElement(By.id('qunit-testresult')).getAttribute(attrName).then(function(text) {
        textContent = text;
        cb();
      });
    }, function() {
      driver.findElement(By.id("qunit-xml")).getAttribute("innerHTML").then(function(innerHTML) {
        console.log(textContent);
        var fileName = path.split('/').pop();
        fs.writeFile('target/surefire-reports/TEST-' + browserName + '-' + fileName + '.txt', textContent);
        fs.writeFile('target/surefire-reports/TEST-' + browserName + '-' + fileName + '.xml', innerHTML);
      });
      driver.findElement(By.className("failed")).getText().then(function(failed) {
        failed.should.equal('0');
      });
    });
  }
  test.it('qunit test with selenium-webdriver', function() {
    testSingle('http://localhost', '/qunit-ci/src/test/qunit/index.html');
  });
});
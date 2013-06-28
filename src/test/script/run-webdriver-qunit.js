var async = require('async');
var should = require('should');
var webdriver = require('selenium-webdriver');
var remote = require('selenium-webdriver/remote');
var test = require('selenium-webdriver/testing');
var fs = require('fs');

test.describe('#selenium-webdriver', function() {
  var driver, server; 
  var browserName = process.env.BrowserName || 'phantomjs';// phantomjs, firefox, chrome, ie, safari

  test.before(function() {
    var seleniumJar = process.env.SeleniumJar || 'node_modules/webdriverjs/bin/selenium-server-standalone-2.31.0.jar';
    var seleniumPort = process.env.SeleniumPort || 4444;
    
    server = new remote.SeleniumServer({
      jar : seleniumJar,
      port : seleniumPort
    });
    server.start();

    driver = new webdriver.Builder().usingServer(server.address()).withCapabilities({
      browserName : browserName,
      ignoreProtectedModeSettings: true
    }).build();
    
  });
  test.after(function() {
    driver.quit();
    server.stop();
  });
  var testQunit = function(baseUrl, path) {
    console.log('Testing ' + baseUrl + path);
    
    driver.get(baseUrl + path);
    var By = webdriver.By;
    var textContent = '';
    var bool = true;

    async.whilst(function() {
      return textContent.indexOf('completed') < 0;
    }, function(cb) {
      driver.findElement(By.id('qunit-testresult')).getAttribute('textContent').then(function(text) {
        textContent = text;
        cb();
      });
    }, function() {
      driver.findElement(By.id('qunit-xml')).getAttribute('innerHTML').then(function(innerHTML) {
        console.log(textContent);
        var fileName = path.split('/').pop();
        
        var chunk = ''; 
        chunk += '-------------------------------------------------------------------------------\n';
        chunk += 'Test set: ' + path +'\n';
        chunk += '-------------------------------------------------------------------------------\n';
        chunk += textContent;
        
        fs.writeFile('target/surefire-reports/TEST-' + browserName + '-' + fileName + '.txt', chunk);
        fs.writeFile('target/surefire-reports/TEST-' + browserName + '-' + fileName + '.xml', innerHTML);
      });
      driver.findElement(By.className('failed')).getText().then(function(failed) {
        failed.should.equal('0');
      });
    });
  }
  test.it('qunit test with selenium-webdriver', function() {
    var json = require('../resources/qunit.json');
    var baseUrl = process.env.BaseUrl || json.baseUrl;
    for(var i in json.tests){
      testQunit(baseUrl, json.tests[i].path);
    }
    
  });
});
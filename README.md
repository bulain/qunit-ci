###This is qunit auto run project.
1. Using selenium to start real browser.
2. Using selenium to get test results.
3. Using qunit-reporter-junit to gengerate junit style test report.

###If you want to run this project, please follow the next steps:
####checkout out qunit-ci:
```shell
git clone https://github.com/bulain/qunit-ci.git
```

####run testing
download chromedriver, phantomjs and IEDriverServer, SafariDriver then put them into PATH.

Node version
```shell
npm install
grunt 
grunt test
grunt test --port=9000 --seleniumPort=4444
grunt all
```
    
Java version
```shell
mvn eclipse:eclipse
mvn verify
mvn verify -Plinux
mvn verify -Pwindows -Dport=8000 -DstopPort=9900
```

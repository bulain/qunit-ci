This is qunit auto run project.

1. Using selenium to start real browser.
2. Using selenium to get test results.
3. Using qunit-reporter-junit to gengerate junit style test report.


If you want to run this project, please follow the next steps:

1 checkout out web-static:
    git clone https://github.com/bulain/web-static.git
    configure it in web server. ex: apache
    the path should be http://ip:port/web-static
2. checkout out web-static-demo:
    git clone https://github.com/bulain/web-static-demo.git
    configure it in web server. ex: apache
    the path should be http://ip:port/web-static-demo
3. checkout out parent and run: 
    git clone https://github.com/bulain/parent.git
    mvn install
4. checkout out qunit-ci:
    git clone https://github.com/bulain/qunit-ci.git
    update baseUrl in file /qunit-ci/src/test/resources/qunit.json
    mvn eclipse:eclipse
    mvn test
    mvn test -DWebDriver=FirefoxDriver
    
###This is qunit auto run project.
1. Using selenium to start real browser.
2. Using selenium to get test results.
3. Using qunit-reporter-junit to gengerate junit style test report.

###If you want to run this project, please follow the next steps:
#####checkout out qunit-ci:
    git clone https://github.com/bulain/qunit-ci.git
    mvn eclipse:eclipse

#####run testing
download chromedriver, phantomjs and IEDriverServer, SafariDriver then put them into PATH.
    npm install
    grunt test
    grunt it
    grunt all --port=9000
    
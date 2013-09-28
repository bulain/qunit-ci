package com.bulain.qunit;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.concurrent.TimeUnit;

import org.junit.BeforeClass;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.ie.InternetExplorerDriver;
import org.openqa.selenium.phantomjs.PhantomJSDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.safari.SafariDriver;

public abstract class BaseWebDriver {
    private static final String CHROME = "chrome";
    private static final String FIREFOX = "firefox";
    private static final String SAFARI = "safari";
    private static final String IE = "ie";
    private static final String PHANTOMJS = "phantomjs";

    private static String DEFAULT_REPORTS_DIR = "target/surefire-reports";
    private static String DEFAULT_FILE_NAME = "qunit.json";

    protected static String[] browserNames;
    protected static String selenumUrl;
    protected static String fileName;
    protected static String reportsDir;

    protected WebDriver driver;

    @BeforeClass
    public static void setUpClass() {

        String temp = System.getProperty("browserNames");
        if (temp != null && temp.length() > 0) {
            browserNames = temp.split(",");
        } else {
            browserNames = new String[]{PHANTOMJS};
        }

        temp = System.getProperty("selenumUrl");
        if (temp != null && temp.trim().length() > 0) {
            selenumUrl = temp;
        }

        reportsDir = System.getProperty("reportsDir");
        if (reportsDir == null || reportsDir.length() == 0) {
            reportsDir = DEFAULT_REPORTS_DIR;
        }

        fileName = System.getProperty("qunitConfig");
        if (fileName == null || fileName.length() == 0) {
            fileName = DEFAULT_FILE_NAME;
        }

    }

    protected void setUp(String browserName) throws MalformedURLException {
        DesiredCapabilities capabilities;
        if (IE.equalsIgnoreCase(browserName)) {
            capabilities = DesiredCapabilities.internetExplorer();
            capabilities.setCapability(InternetExplorerDriver.INTRODUCE_FLAKINESS_BY_IGNORING_SECURITY_DOMAINS, true);
        } else if (FIREFOX.equalsIgnoreCase(browserName)) {
            capabilities = DesiredCapabilities.firefox();
        } else if (CHROME.equalsIgnoreCase(browserName)) {
            capabilities = DesiredCapabilities.chrome();
        } else if (SAFARI.equalsIgnoreCase(browserName)) {
            capabilities = DesiredCapabilities.safari();
        } else {
            capabilities = DesiredCapabilities.phantomjs();
        }

        if (selenumUrl != null) {
            if (IE.equalsIgnoreCase(browserName) || FIREFOX.equalsIgnoreCase(browserName)
                    || CHROME.equalsIgnoreCase(browserName) || SAFARI.equalsIgnoreCase(browserName)) {
                driver = new RemoteWebDriver(new URL(selenumUrl), capabilities);
            } else {
                driver = new PhantomJSDriver(capabilities);
            }
        } else {
            if (IE.equalsIgnoreCase(browserName)) {
                driver = new InternetExplorerDriver(capabilities);
            } else if (FIREFOX.equalsIgnoreCase(browserName)) {
                driver = new FirefoxDriver(capabilities);
            } else if (CHROME.equalsIgnoreCase(browserName)) {
                driver = new ChromeDriver(capabilities);
            } else if (SAFARI.equalsIgnoreCase(browserName)) {
                driver = new SafariDriver(capabilities);
            } else {
                driver = new PhantomJSDriver(capabilities);
            }
        }
    }

    protected void implicitlyWait(Long waitSeconds) {
        driver.manage().timeouts().implicitlyWait(waitSeconds, TimeUnit.SECONDS);
    }

    protected void tearDown() {
        driver.quit();
        driver = null;
    }

}

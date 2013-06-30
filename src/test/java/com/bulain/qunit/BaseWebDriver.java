package com.bulain.qunit;

import java.util.concurrent.TimeUnit;

import org.junit.BeforeClass;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.ie.InternetExplorerDriver;
import org.openqa.selenium.phantomjs.PhantomJSDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.safari.SafariDriver;

public abstract class BaseWebDriver {
    private static final String CHROME = "chrome";
    private static final String FIREFOX = "firefox";
    private static final String SAFARI = "safari";
    private static final String IE = "ie";
    private static final String PHANTOMJS = "phantomjs";

    protected static String[] browserNames;
    protected WebDriver driver;

    @BeforeClass
    public static void setUpClass() {
        String temp = System.getProperty("browserNames");
        if (temp != null) {
            browserNames = temp.split(",");
        } else {
            browserNames = new String[]{PHANTOMJS};
        }
    }

    protected void setUp(String browserName) {
        if (IE.equalsIgnoreCase(browserName)) {
            DesiredCapabilities ieCapabilities = DesiredCapabilities.internetExplorer();
            ieCapabilities.setCapability(InternetExplorerDriver.INTRODUCE_FLAKINESS_BY_IGNORING_SECURITY_DOMAINS, true);
            driver = new InternetExplorerDriver(ieCapabilities);
        } else if (FIREFOX.equalsIgnoreCase(browserName)) {
            DesiredCapabilities firefox = DesiredCapabilities.firefox();
            driver = new FirefoxDriver(firefox);
        } else if (CHROME.equalsIgnoreCase(browserName)) {
            DesiredCapabilities chrome = DesiredCapabilities.chrome();
            driver = new ChromeDriver(chrome);
        } else if (SAFARI.equalsIgnoreCase(browserName)) {
            driver = new SafariDriver();
        } else {
            DesiredCapabilities phantomjs = DesiredCapabilities.phantomjs();
            driver = new PhantomJSDriver(phantomjs);
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

package com.bulain.qunit;

import static org.junit.Assert.assertTrue;

import java.io.File;
import java.io.FileWriter;
import java.io.PrintWriter;

import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.ie.InternetExplorerDriver;

public class QunitTest extends BaseWebDriver {
    private String fileName = "qunit.json";

    @Test
    public void testQunit() throws Exception {
        JSONObject json = QunitUtils.parseJson(fileName);

        String baseUrl  = System.getProperty("BaseUrl");
        if (baseUrl == null) {
            baseUrl = json.getString("baseUrl");
        }
        long defaultWaitSeconds = json.getLong("waitSeconds");

        boolean asserts = true;
        JSONArray tests = json.getJSONArray("tests");
        for (int i = 0; i < tests.length(); i++) {
            JSONObject test = tests.getJSONObject(i);
            long waitSeconds = defaultWaitSeconds;

            if (test.has("waitSeconds")) {
                waitSeconds = test.getLong("waitSeconds");
            }

            String path = test.getString("path");
            boolean results = testPath(baseUrl, path, waitSeconds);
            asserts = asserts && results;
        }

        assertTrue("should pass qunit testing.", asserts);
    }

    public boolean testPath(String baseUrl, String path, long waitSeconds) throws Exception {

        String textContent = null;
        String innerHTML = null;
        boolean result = false;
        Exception exception = null;

        try {
            implicitlyWait(waitSeconds);

            driver.get(baseUrl + path);

            WebElement testresult = driver.findElement(By.id("qunit-testresult"));
            boolean isIE = driver instanceof InternetExplorerDriver;
            String attrName = isIE ? "innerText" : "textContent";
            textContent = testresult.getAttribute(attrName);
            for (int i = 0; i < 10 && !textContent.contains("completed"); i++) {
                try {
                    Thread.sleep(waitSeconds * 1000);
                } catch (InterruptedException e) {
                }
                testresult = driver.findElement(By.id("qunit-testresult"));
                textContent = testresult.getAttribute(attrName);
            }
            WebElement failed = testresult.findElement(By.className("failed"));
            WebElement xml = driver.findElement(By.id("qunit-xml"));
            innerHTML = xml.getAttribute("innerHTML");
            result = "0".equals(failed.getText());
        } catch (Exception t) {
            exception = t;
        }

        String[] split = path.split("/");
        File dir = new File("target/surefire-reports");
        if (!dir.exists()) {
            dir.mkdirs();
        }
        String txtFileName = "TEST-" + driverName + "-" + split[split.length - 1] + ".txt";
        String xmlFileName = "TEST-" + driverName + "-" + split[split.length - 1] + ".xml";

        File txtFile = new File(dir, txtFileName);
        FileWriter txtFileWriter = new FileWriter(txtFile);
        PrintWriter txtWriter = new PrintWriter(txtFileWriter);
        txtWriter.println("-------------------------------------------------------------------------------");
        txtWriter.println("Test set: " + path);
        txtWriter.println("-------------------------------------------------------------------------------");
        if (exception != null) {
            exception.printStackTrace(txtWriter);
        } else {
            txtWriter.println(textContent);
        }
        txtWriter.flush();
        txtWriter.close();
        
        if (exception != null) {
            throw exception;
        }

        File xmlFile = new File(dir, xmlFileName);
        FileWriter xmlFileWriter = new FileWriter(xmlFile);
        PrintWriter xmlWriter = new PrintWriter(xmlFileWriter);
        xmlWriter.println(innerHTML);
        xmlWriter.flush();
        xmlWriter.close();
        
        return result;
    }
}

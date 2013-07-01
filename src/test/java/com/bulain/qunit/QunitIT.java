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

public class QunitIT extends BaseWebDriver {
    private static String DEFAULT_REPORTS_DIR = "target/surefire-reports";
    private static String DEFAULT_FILE_NAME = "qunit.json"; 
    
    private String fileName;
    private String baseUrl;
    private String reportsDir;

    @Test
    public void testQunit() throws Exception {
        reportsDir = System.getProperty("reportsDir");
        if(reportsDir == null){
            reportsDir = DEFAULT_REPORTS_DIR;
        }
        
        fileName = System.getProperty("qunitConfig");
        if(fileName == null){
            fileName = DEFAULT_FILE_NAME;
        }
        
        JSONObject json = QunitUtils.parseJson(fileName);

        baseUrl = System.getProperty("baseUrl");
        if (baseUrl == null) {
            baseUrl = json.getString("baseUrl");
        }
        
        long defaultWaitSeconds = json.getLong("waitSeconds");

        JSONArray tests = json.getJSONArray("tests");
        for (String browserName : browserNames) {
            try {
                boolean asserts = true;
                setUp(browserName);
                for (int i = 0; i < tests.length(); i++) {
                    JSONObject test = tests.getJSONObject(i);
                    long waitSeconds = defaultWaitSeconds;

                    if (test.has("waitSeconds")) {
                        waitSeconds = test.getLong("waitSeconds");
                    }

                    String path = test.getString("path");
                    boolean results = testPath(browserName, path, waitSeconds);
                    asserts = asserts && results;
                }
                tearDown();
                assertTrue("should pass qunit testing.", asserts);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public boolean testPath(String browserName, String path, long waitSeconds) throws Exception {

        String textContent = null;
        String innerHTML = null;
        boolean result = false;
        Exception exception = null;

        try {
            implicitlyWait(waitSeconds);

            driver.get(baseUrl + path);

            WebElement testresult = driver.findElement(By.id("qunit-testresult"));
            textContent = testresult.getAttribute("textContent");
            for (int i = 0; i < 10 && !textContent.contains("completed"); i++) {
                try {
                    Thread.sleep(waitSeconds * 1000);
                } catch (InterruptedException e) {
                }
                testresult = driver.findElement(By.id("qunit-testresult"));
                textContent = testresult.getAttribute("textContent");
            }
            WebElement failed = testresult.findElement(By.className("failed"));
            WebElement xml = driver.findElement(By.id("qunit-xml"));
            innerHTML = xml.getAttribute("innerHTML");
            result = "0".equals(failed.getText());
        } catch (Exception t) {
            exception = t;
        }

        int lastIndex = path.lastIndexOf("/");
        String folder = path.substring(0, lastIndex);
        String fileName = path.substring(lastIndex);
        
        File dir = new File(reportsDir + "/" + browserName + folder);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        
        String txtFileName = fileName + ".txt";
        String xmlFileName = fileName + ".xml";

        File txtFile = new File(dir, txtFileName);
        FileWriter txtFileWriter = new FileWriter(txtFile);
        PrintWriter txtWriter = new PrintWriter(txtFileWriter);
        txtWriter.println("-------------------------------------------------------------------------------");
        txtWriter.println("Test set: " + baseUrl + path);
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

package com.bulain.qunit;

import static org.junit.Assert.assertTrue;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.ie.InternetExplorerDriver;

public class QunitTest extends BaseWebDriver {
    private String fileName = "qunit.json";

    @Test
    public void testQunit() throws IOException, JSONException {
        JSONObject json = QunitUtils.parseJson(fileName);

        String baseUrl = json.getString("baseUrl");
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

    public boolean testPath(String baseUrl, String path, long waitSeconds) throws IOException {
        implicitlyWait(waitSeconds);

        driver.get(baseUrl + path);

        WebElement testresult = driver.findElement(By.id("qunit-testresult"));
        boolean isIE = driver instanceof InternetExplorerDriver;
        String attrName = isIE ? "innerText" : "textContent";
        String textContent = testresult.getAttribute(attrName);
        for (int i = 0; i < 10 && !textContent.contains("completed"); i++) {
            try {
                Thread.sleep(waitSeconds * 1000);
            } catch (InterruptedException e) {
            }
            testresult = driver.findElement(By.id("qunit-testresult"));
            textContent = testresult.getAttribute(attrName);
        }
        WebElement failed = testresult.findElement(By.className("failed"));

        String[] split = path.split("/");
        File dir = new File("target/surefire-reports");
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String fileName = "TEST-" + driverName + "-" + split[split.length - 1] + ".txt";
        File file = new File(dir, fileName);
        FileWriter fileWriter = new FileWriter(file);
        PrintWriter writer = new PrintWriter(fileWriter);
        writer.println("-------------------------------------------------------------------------------");
        writer.println("Test set: " + path);
        writer.println("-------------------------------------------------------------------------------");
        writer.println(textContent);
        writer.flush();
        writer.close();

        System.out.println("-------------------------------------------------------------------------------");
        System.out.println("Test set: " + path);
        System.out.println(textContent);

        WebElement xml = driver.findElement(By.id("qunit-xml"));
        String innerHTML = xml.getAttribute("innerHTML");
        fileName = "TEST-" + driverName + "-" + split[split.length - 1] + ".xml";
        file = new File(dir, fileName);
        fileWriter = new FileWriter(file);
        writer = new PrintWriter(fileWriter);
        writer.println(innerHTML);
        writer.flush();
        writer.close();

        return "0".equals(failed.getText());

    }
}

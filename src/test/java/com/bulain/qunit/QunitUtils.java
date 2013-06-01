package com.bulain.qunit;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;

import org.json.JSONException;
import org.json.JSONObject;

public class QunitUtils {
    public static JSONObject parseJson(String fileName) throws IOException, JSONException {
        InputStream is = QunitUtils.class.getClassLoader().getResourceAsStream(fileName);
        Reader reader = new InputStreamReader(is);

        StringBuilder sb = new StringBuilder();
        char[] chars = new char[1024];
        int n = -1;
        while ((n = reader.read(chars)) > 0) {
            sb.append(chars, 0, n);
        }
        reader.close();
        
        JSONObject json = new JSONObject(sb.toString());
        return json;
    }
}

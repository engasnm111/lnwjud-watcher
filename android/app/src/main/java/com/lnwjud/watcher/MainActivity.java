package com.lnwjud.watcher;

import android.os.Bundle;
import android.webkit.WebView;
import android.util.Log;

import androidx.webkit.WebViewCompat;
import androidx.webkit.WebViewFeature;

import com.getcapacitor.BridgeActivity;

import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Collections;

public class MainActivity extends BridgeActivity {
    @Override
    protected void load() {
        // Run before cached page scripts so an older worker cannot flash its update dialog.
        if (WebViewFeature.isFeatureSupported(WebViewFeature.DOCUMENT_START_SCRIPT)) {
            WebView webView = findViewById(com.getcapacitor.android.R.id.webview);
            if (webView != null) {
                try (InputStreamReader reader = new InputStreamReader(
                        getAssets().open("native-update-migration.js"), StandardCharsets.UTF_8)) {
                    StringBuilder script = new StringBuilder();
                    char[] buffer = new char[1024];
                    int count;
                    while ((count = reader.read(buffer)) != -1) script.append(buffer, 0, count);
                    WebViewCompat.addDocumentStartJavaScript(
                            webView, script.toString(), Collections.singleton("https://localhost"));
                } catch (IOException | IllegalArgumentException | UnsupportedOperationException error) {
                    Log.w("Watcher", "Could not install the native update migration", error);
                }
            }
        }
        super.load();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(WatcherWidgetPlugin.class);
        registerPlugin(NativeUpdaterPlugin.class);
        registerPlugin(WatcherAlertMonitorPlugin.class);
        super.onCreate(savedInstanceState);
    }
}

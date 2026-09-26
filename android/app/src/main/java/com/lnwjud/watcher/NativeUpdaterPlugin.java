package com.lnwjud.watcher;

import android.content.Intent;
import android.net.Uri;

import androidx.core.content.FileProvider;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.PluginMethod;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@CapacitorPlugin(name = "NativeUpdater")
public class NativeUpdaterPlugin extends Plugin {
    private final ExecutorService executor = Executors.newSingleThreadExecutor();

    @PluginMethod
    public void downloadAndInstall(PluginCall call) {
        String rawUrl = call.getString("url");
        if (rawUrl == null || rawUrl.isEmpty()) {
            call.reject("Missing update URL");
            return;
        }

        executor.execute(() -> {
            try {
                URL url = new URL(rawUrl);
                String host = url.getHost();
                if (!"https".equalsIgnoreCase(url.getProtocol())
                        || !(host.equals("github.com") || host.endsWith(".githubusercontent.com"))) {
                    call.reject("Untrusted update URL");
                    return;
                }

                File target = new File(getContext().getCacheDir(), "lnwjud-watcher-update.apk");
                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                connection.setInstanceFollowRedirects(true);
                connection.setConnectTimeout(15000);
                connection.setReadTimeout(60000);
                connection.setRequestProperty("Accept", "application/octet-stream");
                int status = connection.getResponseCode();
                if (status < 200 || status >= 300) {
                    call.reject("Update download failed: HTTP " + status);
                    return;
                }

                try (InputStream input = connection.getInputStream();
                     FileOutputStream output = new FileOutputStream(target, false)) {
                    byte[] buffer = new byte[8192];
                    int read;
                    while ((read = input.read(buffer)) != -1) output.write(buffer, 0, read);
                } finally {
                    connection.disconnect();
                }

                Uri uri = FileProvider.getUriForFile(
                        getContext(),
                        getContext().getPackageName() + ".fileprovider",
                        target
                );
                Intent install = new Intent(Intent.ACTION_VIEW);
                install.setDataAndType(uri, "application/vnd.android.package-archive");
                install.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
                getContext().startActivity(install);

                JSObject result = new JSObject();
                result.put("downloaded", true);
                call.resolve(result);
            } catch (Exception error) {
                call.reject("Update failed", error);
            }
        });
    }
}

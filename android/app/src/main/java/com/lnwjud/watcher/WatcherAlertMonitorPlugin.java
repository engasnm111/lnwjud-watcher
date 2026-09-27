package com.lnwjud.watcher;

import android.Manifest;
import android.os.Build;

import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import org.json.JSONArray;

@CapacitorPlugin(name = "WatcherAlertMonitor", permissions = {
    @Permission(alias = "notifications", strings = { Manifest.permission.POST_NOTIFICATIONS })
})
public class WatcherAlertMonitorPlugin extends Plugin {
    @PluginMethod
    public void requestPermission(PluginCall call) {
        if (Build.VERSION.SDK_INT < 33 || getPermissionState("notifications") == PermissionState.GRANTED) {
            resolvePermission(call, true);
            return;
        }
        requestPermissionForAlias("notifications", call, "permissionCallback");
    }

    @PermissionCallback
    private void permissionCallback(PluginCall call) {
        resolvePermission(call, getPermissionState("notifications") == PermissionState.GRANTED);
    }

    private void resolvePermission(PluginCall call, boolean granted) {
        JSObject result = new JSObject();
        result.put("granted", granted);
        call.resolve(result);
    }

    @PluginMethod
    public void sync(PluginCall call) {
        if (Build.VERSION.SDK_INT >= 33 && getPermissionState("notifications") != PermissionState.GRANTED) {
            call.reject("Android notification permission is not granted");
            return;
        }
        try {
            String endpoint = call.getString("endpoint", "");
            String token = call.getString("token", "");
            long expiresAt = call.getData().optLong("expiresAt", 0);
            int thresholdMinutes = call.getData().optInt("thresholdMinutes", 10);
            JSONArray targets = call.getData().optJSONArray("targets");
            WatcherAlertMonitor.sync(getContext(), endpoint, token, expiresAt, thresholdMinutes, targets);
            call.resolve(new JSObject());
        } catch (Exception error) {
            call.reject("Could not configure Android goal alerts");
        }
    }

    @PluginMethod
    public void disable(PluginCall call) {
        WatcherAlertMonitor.disable(getContext());
        call.resolve(new JSObject());
    }
}

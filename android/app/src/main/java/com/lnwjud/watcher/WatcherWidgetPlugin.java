package com.lnwjud.watcher;

import android.content.Context;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "WatcherWidget")
public class WatcherWidgetPlugin extends Plugin {
    @PluginMethod
    public void update(PluginCall call) {
        String stateJson = call.getString("stateJson", "{}");
        getContext()
                .getSharedPreferences(WatcherWidgetState.PREFS, Context.MODE_PRIVATE)
                .edit()
                .putString(WatcherWidgetState.KEY_STATE, stateJson)
                .apply();
        BaseWatcherWidgetProvider.refreshAll(getContext());
        call.resolve(new JSObject());
    }
}

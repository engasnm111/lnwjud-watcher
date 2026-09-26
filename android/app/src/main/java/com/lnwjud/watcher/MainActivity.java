package com.lnwjud.watcher;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(WatcherWidgetPlugin.class);
        registerPlugin(NativeUpdaterPlugin.class);
        super.onCreate(savedInstanceState);
    }
}

package com.lnwjud.watcher;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class WatcherAlertMonitorReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) {
            WatcherAlertMonitor.restore(context);
            return;
        }
        PendingResult pending = goAsync();
        new Thread(() -> {
            try { WatcherAlertMonitor.checkLatestSnapshot(context); }
            catch (Exception ignored) { /* A failed check must never post an unverified reminder. */ }
            finally { pending.finish(); }
        }, "watcher-alert-check").start();
    }
}

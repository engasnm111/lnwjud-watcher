package com.lnwjud.watcher;

import android.content.Context;
import android.widget.RemoteViews;

public class WatcherStatusWidgetProvider extends BaseWatcherWidgetProvider {
    @Override
    protected int layoutId() {
        return R.layout.widget_watcher_status;
    }

    @Override
    protected void bind(Context context, RemoteViews views, WatcherWidgetState state) {
        String status;
        if ("connected".equals(state.connectionState) || "demo".equals(state.connectionState)) {
            status = state.activeOperations > 0
                    ? context.getString(R.string.widget_working)
                    : context.getString(R.string.widget_idle);
        } else if ("connecting".equals(state.connectionState) || "reconnecting".equals(state.connectionState)) {
            status = context.getString(R.string.widget_reconnecting);
        } else {
            status = context.getString(R.string.widget_offline);
        }
        String work = state.goalTask.isEmpty()
                ? (state.lastActivity.isEmpty() ? context.getString(R.string.widget_no_work) : state.lastActivity)
                : state.goalTask;
        String last = context.getString(
                R.string.widget_status_age,
                WatcherWidgetState.relativeTime(state.lastActivityAt),
                WatcherWidgetState.relativeTime(state.lastSyncAt)
        );

        views.setTextViewText(R.id.widget_title, state.instanceName);
        views.setTextViewText(R.id.widget_status, status);
        views.setTextViewText(R.id.widget_primary, work);
        views.setTextViewText(R.id.widget_secondary, last);
    }
}

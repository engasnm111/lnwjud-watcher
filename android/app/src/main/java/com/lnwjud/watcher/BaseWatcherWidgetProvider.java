package com.lnwjud.watcher;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.widget.RemoteViews;

abstract class BaseWatcherWidgetProvider extends AppWidgetProvider {
    protected abstract int layoutId();
    protected abstract void bind(Context context, RemoteViews views, WatcherWidgetState state);

    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        WatcherWidgetState state = WatcherWidgetState.load(context);
        for (int appWidgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), layoutId());
            bind(context, views, state);
            views.setOnClickPendingIntent(R.id.widget_root, launchIntent(context));
            manager.updateAppWidget(appWidgetId, views);
        }
    }

    static void refreshAll(Context context) {
        AppWidgetManager manager = AppWidgetManager.getInstance(context);
        refresh(context, manager, WatcherStatusWidgetProvider.class);
        refresh(context, manager, WatcherGoalWidgetProvider.class);
        refresh(context, manager, WatcherAgentsWidgetProvider.class);
    }

    private static void refresh(Context context, AppWidgetManager manager, Class<?> providerClass) {
        ComponentName component = new ComponentName(context, providerClass);
        int[] ids = manager.getAppWidgetIds(component);
        if (ids.length == 0) return;
        Intent intent = new Intent(context, providerClass);
        intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids);
        context.sendBroadcast(intent);
    }

    private static PendingIntent launchIntent(Context context) {
        Intent intent = new Intent(context, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        return PendingIntent.getActivity(
                context,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
    }
}

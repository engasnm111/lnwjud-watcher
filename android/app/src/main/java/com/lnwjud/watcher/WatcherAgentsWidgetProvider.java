package com.lnwjud.watcher;

import android.content.Context;
import android.view.View;
import android.widget.RemoteViews;

public class WatcherAgentsWidgetProvider extends BaseWatcherWidgetProvider {
    @Override
    protected int layoutId() {
        return R.layout.widget_watcher_agents;
    }

    @Override
    protected void bind(Context context, RemoteViews views, WatcherWidgetState state) {
        views.setTextViewText(R.id.widget_agents_title, context.getString(R.string.widget_agents));
        views.setTextViewText(
                R.id.widget_agents_count,
                context.getResources().getQuantityString(
                        R.plurals.widget_active_agents,
                        state.activeAgentCount,
                        state.activeAgentCount
                )
        );
        bindAgent(views, R.id.widget_agent_1, state.agent1);
        bindAgent(views, R.id.widget_agent_2, state.agent2);
        String currentWork = state.goalTask.isEmpty()
                ? (state.lastActivity.isEmpty() ? context.getString(R.string.widget_no_work) : state.lastActivity)
                : state.goalTask;
        views.setTextViewText(R.id.widget_agents_work, context.getString(R.string.widget_current_work, currentWork));
        views.setTextViewText(
                R.id.widget_agents_last,
                context.getString(R.string.widget_last_sync, WatcherWidgetState.relativeTime(state.lastSyncAt))
        );
    }

    private static void bindAgent(RemoteViews views, int viewId, String value) {
        boolean visible = value != null && !value.isEmpty();
        views.setViewVisibility(viewId, visible ? View.VISIBLE : View.GONE);
        if (visible) views.setTextViewText(viewId, value);
    }
}

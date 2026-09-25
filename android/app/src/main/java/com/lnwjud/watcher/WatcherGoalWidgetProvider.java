package com.lnwjud.watcher;

import android.content.Context;
import android.widget.RemoteViews;

public class WatcherGoalWidgetProvider extends BaseWatcherWidgetProvider {
    @Override
    protected int layoutId() {
        return R.layout.widget_watcher_goal;
    }

    @Override
    protected void bind(Context context, RemoteViews views, WatcherWidgetState state) {
        String title = state.goalTitle.isEmpty()
                ? context.getString(R.string.widget_no_goal)
                : state.goalTitle;
        String task = state.goalTask.isEmpty()
                ? context.getString(R.string.widget_no_work)
                : state.goalTask;
        String project = state.goalProject.isEmpty() ? state.instanceName : state.goalProject;
        String progress = state.totalMilestones > 0
                ? state.completedMilestones + "/" + state.totalMilestones
                : "—";

        views.setTextViewText(R.id.widget_goal_project, project);
        views.setTextViewText(R.id.widget_goal_title, title);
        views.setTextViewText(R.id.widget_goal_task, task);
        views.setTextViewText(R.id.widget_goal_progress, context.getString(R.string.widget_progress, progress));
        views.setTextViewText(
                R.id.widget_goal_last,
                context.getString(R.string.widget_last_work, WatcherWidgetState.relativeTime(state.lastActivityAt))
        );
    }
}

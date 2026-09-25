package com.lnwjud.watcher;

import android.content.Context;
import android.text.format.DateUtils;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

final class WatcherWidgetState {
    static final String PREFS = "lnwjud_watcher_widget";
    static final String KEY_STATE = "state_json";

    final String instanceName;
    final String connectionState;
    final String runtimeStatus;
    final int activeOperations;
    final int activeGoalCount;
    final int activeAgentCount;
    final String goalTitle;
    final String goalTask;
    final String goalProject;
    final int completedMilestones;
    final int totalMilestones;
    final String agent1;
    final String agent2;
    final String lastActivity;
    final String lastActivityAt;
    final String lastSyncAt;

    private WatcherWidgetState(JSONObject root) {
        instanceName = root.optString("instanceName", "lnwjud Watcher");
        connectionState = root.optString("connectionState", "offline");
        runtimeStatus = root.optString("runtimeStatus", "offline");
        activeOperations = root.optInt("activeOperations", 0);
        activeGoalCount = root.optInt("activeGoalCount", 0);
        activeAgentCount = root.optInt("activeAgentCount", 0);

        JSONObject goal = root.optJSONObject("currentGoal");
        goalTitle = goal == null ? "" : goal.optString("title", "");
        goalTask = goal == null ? "" : goal.optString("task", "");
        goalProject = goal == null ? "" : goal.optString("project", "");
        completedMilestones = goal == null ? 0 : goal.optInt("completedMilestones", 0);
        totalMilestones = goal == null ? 0 : goal.optInt("totalMilestones", 0);

        JSONArray agents = root.optJSONArray("agents");
        agent1 = agentLine(agents, 0);
        agent2 = agentLine(agents, 1);

        JSONObject activity = root.optJSONObject("lastActivity");
        lastActivity = activity == null ? "" : activity.optString("summary", "");
        lastActivityAt = activity == null ? "" : activity.optString("timestamp", "");
        lastSyncAt = root.optString("lastSyncAt", "");
    }

    static WatcherWidgetState load(Context context) {
        String raw = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString(KEY_STATE, "{}");
        try {
            return new WatcherWidgetState(new JSONObject(raw == null ? "{}" : raw));
        } catch (JSONException error) {
            return new WatcherWidgetState(new JSONObject());
        }
    }

    static String relativeTime(String isoTimestamp) {
        if (isoTimestamp == null || isoTimestamp.isEmpty()) return "—";
        Date parsed = parseIso(isoTimestamp);
        if (parsed == null) return "—";
        return DateUtils.getRelativeTimeSpanString(
                parsed.getTime(),
                System.currentTimeMillis(),
                DateUtils.MINUTE_IN_MILLIS,
                DateUtils.FORMAT_ABBREV_RELATIVE
        ).toString();
    }

    private static Date parseIso(String value) {
        String[] patterns = {
                "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
                "yyyy-MM-dd'T'HH:mm:ssXXX",
                "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
                "yyyy-MM-dd'T'HH:mm:ss'Z'"
        };
        for (String pattern : patterns) {
            try {
                return new SimpleDateFormat(pattern, Locale.US).parse(value);
            } catch (ParseException ignored) {
            }
        }
        return null;
    }

    private static String agentLine(JSONArray agents, int index) {
        if (agents == null || index >= agents.length()) return "";
        JSONObject agent = agents.optJSONObject(index);
        if (agent == null) return "";
        String name = agent.optString("name", "Agent");
        String task = agent.optString("task", "");
        return task.isEmpty() ? name : name + " · " + task;
    }
}

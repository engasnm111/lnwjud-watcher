package com.lnwjud.watcher;

import android.Manifest;
import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.os.SystemClock;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.Base64;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.KeyStore;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.TimeZone;
import java.util.UUID;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;

/** Read-only, best-effort Android reminder. Every notification requires a fresh authenticated snapshot. */
final class WatcherAlertMonitor {
    private static final String PREFS = "watcher_alert_monitor";
    private static final String KEY_ALIAS = "watcher_alert_token_v1";
    private static final String CHANNEL_ID = "watcher_goal_activity_v1";
    private static final String ACTION_CHECK = "com.lnwjud.watcher.CHECK_GOAL_ACTIVITY";
    private static final int REQUEST_CODE = 4612;
    private static final int NOTIFICATION_ID = 4612;
    private static final long RECHECK_MS = 15 * 60_000L;
    private static final int MAX_RESPONSE_BYTES = 1_000_000;

    private WatcherAlertMonitor() {}

    static synchronized void sync(Context context, String endpoint, String token, long expiresAt, int thresholdMinutes, JSONArray incoming) throws Exception {
        Context app = context.getApplicationContext();
        if (thresholdMinutes != 5 && thresholdMinutes != 10) throw new IllegalArgumentException("Invalid threshold");
        if (incoming == null || incoming.length() > 50 || token == null || token.length() < 32 || expiresAt <= System.currentTimeMillis()) {
            throw new IllegalArgumentException("Invalid alert configuration");
        }
        if (incoming.length() == 0) { disable(app); return; }
        String normalizedEndpoint = normalizeEndpoint(endpoint);
        SharedPreferences prefs = prefs(app);
        JSONArray oldTargets = readTargets(prefs);
        boolean sameEndpoint = normalizedEndpoint.equals(prefs.getString("endpoint", ""));
        int oldThreshold = prefs.getInt("threshold", 10);
        Map<String, JSONObject> oldById = byId(oldTargets);
        JSONArray nextTargets = new JSONArray();
        Set<String> retained = new HashSet<>();
        long now = System.currentTimeMillis();

        for (int index = 0; index < incoming.length(); index++) {
            JSONObject input = incoming.optJSONObject(index);
            if (input == null) continue;
            String id = bounded(input.optString("id"), 256);
            String goalId = bounded(input.optString("goalId"), 128);
            String workspaceId = bounded(input.optString("workspaceId"), 128);
            String key = bounded(input.optString("key"), 120);
            String workspaceName = bounded(input.optString("workspaceName"), 120);
            String observedAt = input.optString("observedAt");
            if (id.isEmpty() || goalId.isEmpty() || workspaceId.isEmpty() || parseTime(observedAt) <= 0) continue;
            JSONObject previous = sameEndpoint ? oldById.get(id) : null;
            boolean sameEpisode = previous != null && observedAt.equals(previous.optString("observedAt")) && oldThreshold == thresholdMinutes;
            JSONObject target = new JSONObject();
            target.put("id", id);
            target.put("goalId", goalId);
            target.put("workspaceId", workspaceId);
            target.put("key", key);
            target.put("workspaceName", workspaceName);
            target.put("observedAt", observedAt);
            target.put("dueAt", sameEpisode ? previous.optLong("dueAt") : Math.max(now + thresholdMinutes * 60_000L, parseTime(observedAt) + thresholdMinutes * 60_000L));
            target.put("notified", sameEpisode && previous.optBoolean("notified"));
            nextTargets.put(target);
            retained.add(id);
            if (!sameEpisode) cancelNotification(app, id);
        }
        for (String oldId : oldById.keySet()) if (!retained.contains(oldId)) cancelNotification(app, oldId);

        String encryptedToken = encrypt(token);
        if (!prefs.edit()
            .putString("endpoint", normalizedEndpoint)
            .putString("token", encryptedToken)
            .putString("generation", UUID.randomUUID().toString())
            .putLong("expiresAt", expiresAt)
            .putInt("threshold", thresholdMinutes)
            .putString("targets", nextTargets.toString())
            .commit()) throw new IllegalStateException("Alert state could not be saved");
        scheduleNext(app, nextTargets);
    }

    static synchronized void disable(Context context) {
        Context app = context.getApplicationContext();
        for (String id : byId(readTargets(prefs(app))).keySet()) cancelNotification(app, id);
        cancelAlarm(app);
        prefs(app).edit().clear().commit();
    }

    static synchronized void restore(Context context) {
        Context app = context.getApplicationContext();
        SharedPreferences prefs = prefs(app);
        if (prefs.getLong("expiresAt", 0) <= System.currentTimeMillis()) { disable(app); return; }
        scheduleNext(app, readTargets(prefs));
    }

    static void checkLatestSnapshot(Context context) throws Exception {
        Context app = context.getApplicationContext();
        SharedPreferences prefs = prefs(app);
        long now = System.currentTimeMillis();
        if (prefs.getLong("expiresAt", 0) <= now) { disable(app); return; }
        String endpoint = prefs.getString("endpoint", "");
        String generation = prefs.getString("generation", "");
        JSONArray currentTargets = readTargets(prefs);
        if (currentTargets.length() == 0) { cancelAlarm(app); return; }

        JSONObject snapshot;
        try { snapshot = fetchSnapshot(endpoint, decrypt(prefs.getString("token", ""))); }
        catch (Exception ignored) {
            if (generation.equals(prefs(app).getString("generation", ""))) scheduleAt(app, now + RECHECK_MS);
            return;
        }

        synchronized (WatcherAlertMonitor.class) {
            // A foreground sync may have changed the endpoint or goal list during the fetch.
            prefs = prefs(app);
            if (!generation.equals(prefs.getString("generation", "")) || prefs.getLong("expiresAt", 0) <= System.currentTimeMillis()) return;
            JSONArray savedTargets = readTargets(prefs);
            JSONArray nextTargets = new JSONArray();
            int threshold = prefs.getInt("threshold", 10);
            now = System.currentTimeMillis();
            for (int index = 0; index < savedTargets.length(); index++) {
                JSONObject target = savedTargets.optJSONObject(index);
                if (target == null) continue;
                String id = target.optString("id");
                JSONObject workspace = findWorkspace(snapshot, target.optString("workspaceId"));
                JSONObject goal = workspace == null ? null : findGoal(workspace, target.optString("goalId"));
                if (goal == null || goal.optBoolean("completionReady")
                    || (!goal.has("completionReady") && allMilestonesComplete(goal))
                    || goal.optJSONArray("blockers") != null && goal.optJSONArray("blockers").length() > 0) {
                    cancelNotification(app, id);
                    continue;
                }
                String status = goal.optString("status");
                if (!"waiting".equals(status) && !"idle".equals(status)) {
                    target.put("dueAt", now + threshold * 60_000L);
                    nextTargets.put(target);
                    continue;
                }
                String observedAt = lastObservedAt(snapshot, workspace, goal);
                if (parseTime(observedAt) > parseTime(target.optString("observedAt"))) {
                    target.remove("observedAt");
                    target.put("observedAt", observedAt);
                    target.put("dueAt", Math.max(now + 1000, parseTime(observedAt) + threshold * 60_000L));
                    target.put("notified", false);
                    cancelNotification(app, id);
                }
                if (workspace.optInt("activeOperations", 0) > 0 || goal.optInt("activeTaskCount", 0) > 0) {
                    target.put("dueAt", now + threshold * 60_000L);
                } else if (!target.optBoolean("notified") && now >= target.optLong("dueAt", Long.MAX_VALUE)) {
                    if (postNotification(app, target)) target.put("notified", true);
                    else target.put("dueAt", now + RECHECK_MS);
                }
                nextTargets.put(target);
            }
            if (nextTargets.length() == 0) { disable(app); return; }
            prefs.edit().putString("targets", nextTargets.toString()).commit();
            scheduleNext(app, nextTargets);
        }
    }

    private static JSONObject fetchSnapshot(String endpoint, String token) throws Exception {
        URL url = new URL(endpoint + "/api/v1/snapshot");
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setInstanceFollowRedirects(false);
        connection.setConnectTimeout(3_000);
        connection.setReadTimeout(3_000);
        connection.setRequestProperty("Authorization", "Bearer " + token);
        connection.setRequestProperty("Accept", "application/json");
        try {
            if (connection.getResponseCode() != 200) throw new IllegalStateException("Watcher snapshot unavailable");
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            try (InputStream input = connection.getInputStream()) {
                byte[] buffer = new byte[8192];
                int read;
                while ((read = input.read(buffer)) != -1) {
                    if (output.size() + read > MAX_RESPONSE_BYTES) throw new IllegalStateException("Watcher snapshot too large");
                    output.write(buffer, 0, read);
                }
            }
            JSONObject snapshot = new JSONObject(output.toString(StandardCharsets.UTF_8.name()));
            long serverTime = parseTime(snapshot.optString("serverTime"));
            if (snapshot.optInt("protocolVersion") != 1 || serverTime <= 0 || Math.abs(System.currentTimeMillis() - serverTime) > 2 * 60_000L) {
                throw new IllegalStateException("Watcher snapshot is stale or incompatible");
            }
            return snapshot;
        } finally { connection.disconnect(); }
    }

    private static JSONObject findWorkspace(JSONObject snapshot, String id) {
        JSONArray workspaces = snapshot.optJSONArray("workspaces");
        if (workspaces == null) return null;
        for (int index = 0; index < workspaces.length(); index++) {
            JSONObject workspace = workspaces.optJSONObject(index);
            if (workspace != null && id.equals(workspace.optString("id"))) return workspace;
        }
        return null;
    }

    private static JSONObject findGoal(JSONObject workspace, String id) {
        JSONArray goals = workspace.optJSONArray("goals");
        if (goals == null) return null;
        for (int index = 0; index < goals.length(); index++) {
            JSONObject goal = goals.optJSONObject(index);
            if (goal != null && id.equals(goal.optString("id"))) return goal;
        }
        return null;
    }

    private static boolean allMilestonesComplete(JSONObject goal) {
        JSONArray milestones = goal.optJSONArray("milestones");
        if (milestones == null || milestones.length() == 0) return false;
        for (int index = 0; index < milestones.length(); index++) {
            JSONObject milestone = milestones.optJSONObject(index);
            if (milestone == null || !"completed".equals(milestone.optString("status"))) return false;
        }
        return true;
    }

    private static String lastObservedAt(JSONObject snapshot, JSONObject workspace, JSONObject goal) {
        String latest = goal.optString("createdAt");
        String checkpoint = goal.optString("lastCheckpointAt");
        if (parseTime(checkpoint) > parseTime(latest)) latest = checkpoint;
        JSONArray activity = snapshot.optJSONArray("activity");
        if (activity != null) for (int index = 0; index < activity.length(); index++) {
            JSONObject event = activity.optJSONObject(index);
            if (event == null || !workspace.optString("id").equals(event.optString("workspaceId"))) continue;
            String timestamp = event.optString("timestamp");
            if (parseTime(timestamp) > parseTime(latest)) latest = timestamp;
        }
        return latest;
    }

    private static boolean postNotification(Context context, JSONObject target) {
        if (Build.VERSION.SDK_INT >= 33 && ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) return false;
        NotificationManager manager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (Build.VERSION.SDK_INT >= 26) {
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, context.getString(R.string.alert_channel_name), NotificationManager.IMPORTANCE_DEFAULT);
            channel.setDescription(context.getString(R.string.alert_channel_description));
            manager.createNotificationChannel(channel);
        }
        Intent open = new Intent(context, MainActivity.class);
        open.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent content = PendingIntent.getActivity(context, REQUEST_CODE, open, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        String key = target.optString("key");
        String project = target.optString("workspaceName");
        NotificationCompat.Builder notification = new NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_watcher_notification)
            .setLargeIcon(BitmapFactory.decodeResource(context.getResources(), R.mipmap.ic_launcher_foreground))
            .setContentTitle(context.getString(R.string.alert_stalled_title))
            .setContentText(context.getString(R.string.alert_stalled_body, key, project))
            .setStyle(new NotificationCompat.BigTextStyle().bigText(context.getString(R.string.alert_stalled_body, key, project)))
            .setContentIntent(content)
            .setAutoCancel(true)
            .setOnlyAlertOnce(true)
            .setCategory(NotificationCompat.CATEGORY_STATUS);
        try {
            NotificationManagerCompat.from(context).notify(notificationTag(target.optString("id")), NOTIFICATION_ID, notification.build());
            return true;
        } catch (SecurityException ignored) { return false; }
    }

    private static void cancelNotification(Context context, String id) {
        NotificationManagerCompat.from(context).cancel(notificationTag(id), NOTIFICATION_ID);
    }

    private static String notificationTag(String id) { return "watcher-goal:" + id; }

    private static void scheduleNext(Context context, JSONArray targets) {
        if (targets.length() == 0) { cancelAlarm(context); return; }
        long now = System.currentTimeMillis();
        long next = now + RECHECK_MS;
        for (int index = 0; index < targets.length(); index++) {
            JSONObject target = targets.optJSONObject(index);
            if (target != null && !target.optBoolean("notified")) next = Math.min(next, Math.max(now + 5_000L, target.optLong("dueAt", now + RECHECK_MS)));
        }
        scheduleAt(context, next);
    }

    private static void scheduleAt(Context context, long wallTime) {
        AlarmManager manager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        long delay = Math.max(5_000L, wallTime - System.currentTimeMillis());
        if (Build.VERSION.SDK_INT >= 23) manager.setAndAllowWhileIdle(AlarmManager.ELAPSED_REALTIME_WAKEUP, SystemClock.elapsedRealtime() + delay, alarmIntent(context));
        else manager.set(AlarmManager.ELAPSED_REALTIME_WAKEUP, SystemClock.elapsedRealtime() + delay, alarmIntent(context));
    }

    private static void cancelAlarm(Context context) {
        AlarmManager manager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        manager.cancel(alarmIntent(context));
    }

    private static PendingIntent alarmIntent(Context context) {
        Intent intent = new Intent(context, WatcherAlertMonitorReceiver.class);
        intent.setAction(ACTION_CHECK);
        return PendingIntent.getBroadcast(context, REQUEST_CODE, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    private static SharedPreferences prefs(Context context) { return context.getSharedPreferences(PREFS, Context.MODE_PRIVATE); }

    private static JSONArray readTargets(SharedPreferences prefs) {
        try { return new JSONArray(prefs.getString("targets", "[]")); }
        catch (Exception ignored) { return new JSONArray(); }
    }

    private static Map<String, JSONObject> byId(JSONArray targets) {
        Map<String, JSONObject> result = new HashMap<>();
        for (int index = 0; index < targets.length(); index++) {
            JSONObject target = targets.optJSONObject(index);
            if (target != null) result.put(target.optString("id"), target);
        }
        return result;
    }

    private static String normalizeEndpoint(String endpoint) throws Exception {
        URI uri = new URI(endpoint.trim());
        String scheme = uri.getScheme();
        String host = uri.getHost();
        boolean loopback = "localhost".equalsIgnoreCase(host) || "127.0.0.1".equals(host) || "::1".equals(host);
        if (!("https".equals(scheme) || "http".equals(scheme) && loopback)
            || host == null || uri.getRawUserInfo() != null || uri.getFragment() != null || uri.getRawQuery() != null) {
            throw new IllegalArgumentException("Invalid Watcher endpoint");
        }
        return uri.toString().replaceAll("/+$", "");
    }

    private static String bounded(String value, int max) { return value == null ? "" : value.substring(0, Math.min(max, value.length())); }

    private static long parseTime(String value) {
        if (value == null || value.isEmpty()) return 0;
        for (String pattern : Arrays.asList("yyyy-MM-dd'T'HH:mm:ss.SSSX", "yyyy-MM-dd'T'HH:mm:ssX")) {
            try {
                SimpleDateFormat formatter = new SimpleDateFormat(pattern, Locale.US);
                formatter.setTimeZone(TimeZone.getTimeZone("UTC"));
                Date date = formatter.parse(value);
                if (date != null) return date.getTime();
            } catch (Exception ignored) { /* Try the next ISO representation. */ }
        }
        return 0;
    }

    private static SecretKey key() throws Exception {
        KeyStore store = KeyStore.getInstance("AndroidKeyStore");
        store.load(null);
        if (store.containsAlias(KEY_ALIAS)) return (SecretKey) store.getKey(KEY_ALIAS, null);
        KeyGenerator generator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore");
        generator.init(new KeyGenParameterSpec.Builder(KEY_ALIAS, KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT)
            .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
            .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
            .build());
        return generator.generateKey();
    }

    private static String encrypt(String value) throws Exception {
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        cipher.init(Cipher.ENCRYPT_MODE, key());
        byte[] ciphertext = cipher.doFinal(value.getBytes(StandardCharsets.UTF_8));
        byte[] iv = cipher.getIV();
        byte[] result = new byte[iv.length + ciphertext.length];
        System.arraycopy(iv, 0, result, 0, iv.length);
        System.arraycopy(ciphertext, 0, result, iv.length, ciphertext.length);
        return Base64.encodeToString(result, Base64.NO_WRAP);
    }

    private static String decrypt(String value) throws Exception {
        byte[] encrypted = Base64.decode(value, Base64.NO_WRAP);
        if (encrypted.length < 29) throw new IllegalArgumentException("Invalid encrypted token");
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        cipher.init(Cipher.DECRYPT_MODE, key(), new GCMParameterSpec(128, Arrays.copyOfRange(encrypted, 0, 12)));
        return new String(cipher.doFinal(Arrays.copyOfRange(encrypted, 12, encrypted.length)), StandardCharsets.UTF_8);
    }
}

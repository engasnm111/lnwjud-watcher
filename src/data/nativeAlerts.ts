import { Capacitor, registerPlugin } from '@capacitor/core';
import type { ConnectionProfile, ConnectionState, WatcherSnapshot } from '../domain/models';
import { goalLastObservedAt } from '../domain/alerts';
import type { AlertPreferences } from './alertPreferences';
import { loadSessionTokenExpiresAt } from './profile';

interface NativeAlertMonitorPlugin {
  requestPermission(): Promise<{ granted: boolean }>;
  sync(options: {
    endpoint: string;
    token: string;
    expiresAt: number;
    thresholdMinutes: 5 | 10;
    targets: Array<{ id: string; goalId: string; key: string; workspaceId: string; workspaceName: string; observedAt: string }>;
  }): Promise<void>;
  disable(): Promise<void>;
}

const NativeAlertMonitor = registerPlugin<NativeAlertMonitorPlugin>('WatcherAlertMonitor');

export function isAndroid(): boolean {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
}

export async function requestAndroidAlertPermission(): Promise<boolean> {
  if (!isAndroid()) return false;
  try { return (await NativeAlertMonitor.requestPermission()).granted; }
  catch { return false; }
}

export function buildNativeAlertTargets(snapshot: WatcherSnapshot) {
  return snapshot.workspaces.flatMap((workspace) => workspace.goals.flatMap((goal) => {
    const allMilestonesDone = goal.milestones.length > 0 && goal.milestones.every((step) => step.status === 'completed');
    if (goal.completionReady === true || (goal.completionReady === undefined && allMilestonesDone)) return [];
    if (goal.blockers.length > 0 || goal.status === 'done' || goal.status === 'blocked') return [];
    const observedAt = goalLastObservedAt(snapshot, goal, workspace.id);
    if (observedAt === null) return [];
    return [{
      id: `${snapshot.instance.id}:${goal.id}`,
      goalId: goal.id,
      key: goal.key.slice(0, 120),
      workspaceId: workspace.id,
      workspaceName: workspace.name.slice(0, 120),
      observedAt,
    }];
  }));
}

export async function syncNativeAlertMonitor(
  snapshot: WatcherSnapshot | null,
  state: ConnectionState,
  profile: ConnectionProfile,
  token: string,
  preferences: AlertPreferences,
): Promise<void> {
  if (!isAndroid()) return;
  try {
    if (!preferences.androidNotifications || profile.mode !== 'remote' || !token) {
      await NativeAlertMonitor.disable();
      return;
    }
    if (state !== 'connected' || snapshot === null) return;
    const expiresAt = loadSessionTokenExpiresAt();
    if (expiresAt === null) { await NativeAlertMonitor.disable(); return; }
    await NativeAlertMonitor.sync({
      endpoint: profile.endpoint,
      token,
      expiresAt,
      thresholdMinutes: preferences.inactivityMinutes,
      targets: buildNativeAlertTargets(snapshot),
    });
  } catch {
    // Native notifications must never interrupt Watcher's read-only UI.
  }
}

export async function disableNativeAlertMonitor(): Promise<void> {
  if (!isAndroid()) return;
  try { await NativeAlertMonitor.disable(); } catch { /* optional adapter */ }
}

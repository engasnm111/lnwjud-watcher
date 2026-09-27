import type { ConnectionState, Goal, WatcherSnapshot } from './models';

export type AlertKind = 'connection' | 'goal_stalled' | 'goal_ready' | 'goal_blocked';
export interface WatcherAlert {
  id: string;
  kind: AlertKind;
  severity: 'warning' | 'info';
  workspaceId?: string;
  workspaceName?: string;
  goalId?: string;
  goalKey?: string;
  since: string;
}

export interface AlertInput {
  snapshot: WatcherSnapshot | null;
  state: ConnectionState;
  mode: 'demo' | 'remote';
  lastSyncAt: string | null;
  now: number;
  inactivityMinutes: 5 | 10;
}

const FRESH_SNAPSHOT_MS = 2 * 60_000;

function validTime(value: string | undefined): number | null {
  const timestamp = value === undefined ? NaN : Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}

export function goalLastObservedAt(snapshot: WatcherSnapshot, goal: Goal, workspaceId: string): string | null {
  const candidates = [goal.createdAt, goal.lastCheckpointAt]
    .map(validTime).filter((value): value is number => value !== null);
  for (const event of snapshot.activity) {
    if (event.workspaceId !== workspaceId) continue;
    const timestamp = validTime(event.timestamp);
    if (timestamp !== null) candidates.push(timestamp);
  }
  return candidates.length === 0 ? null : new Date(Math.max(...candidates)).toISOString();
}

/** Only a fresh, connected snapshot can create a stalled-work alert. */
export function deriveAlerts(input: AlertInput): WatcherAlert[] {
  const { snapshot, state, mode, lastSyncAt, now, inactivityMinutes } = input;
  if (mode === 'demo') return [];
  if (state !== 'connected') {
    return [{ id: 'connection', kind: 'connection', severity: 'warning', since: lastSyncAt ?? new Date(now).toISOString() }];
  }
  const lastSync = validTime(lastSyncAt ?? undefined);
  if (snapshot === null || lastSync === null || now - lastSync > FRESH_SNAPSHOT_MS) return [];

  const alerts: WatcherAlert[] = [];
  for (const workspace of snapshot.workspaces) {
    for (const goal of workspace.goals) {
      const base = {
        workspaceId: workspace.id, workspaceName: workspace.name,
        goalId: goal.id, goalKey: goal.key,
      };
      const lastObservedAt = goalLastObservedAt(snapshot, goal, workspace.id);
      if (goal.blockers.length > 0) {
        alerts.push({ ...base, id: `blocked:${snapshot.instance.id}:${goal.id}:${goal.blockers.join('|')}`, kind: 'goal_blocked', severity: 'warning', since: goal.lastCheckpointAt ?? goal.updatedAt ?? lastSyncAt! });
        continue;
      }
      const legacyReady = goal.completionReady === undefined && goal.milestones.length > 0
        && goal.milestones.every((step) => step.status === 'completed');
      if (goal.completionReady === true || legacyReady) {
        alerts.push({ ...base, id: `ready:${snapshot.instance.id}:${goal.id}`, kind: 'goal_ready', severity: 'info', since: goal.lastCheckpointAt ?? goal.updatedAt ?? lastSyncAt! });
        continue;
      }
      if (goal.status !== 'waiting' && goal.status !== 'idle') continue;
      if (workspace.activeOperations > 0 || (goal.activeTaskCount ?? 0) > 0 || lastObservedAt === null) continue;
      const lastObserved = validTime(lastObservedAt)!;
      if (lastObserved > now || now - lastObserved < inactivityMinutes * 60_000) continue;
      alerts.push({ ...base, id: `stalled:${snapshot.instance.id}:${goal.id}:${lastObservedAt}`, kind: 'goal_stalled', severity: 'warning', since: lastObservedAt });
    }
  }
  return alerts;
}

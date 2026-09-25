import type { Goal, WatcherSnapshot, WorkspaceSnapshot } from '../domain/models';

export function goalProgress(goal: Goal | null): number {
  if (!goal || goal.milestones.length === 0) return 0;
  const done = goal.milestones.filter((milestone) => milestone.status === 'completed').length;
  return Math.round((done / goal.milestones.length) * 100);
}

export function snapshotWorkspaces(snapshot: WatcherSnapshot): WorkspaceSnapshot[] {
  if (snapshot.workspaces.length > 0) return snapshot.workspaces;
  return [{
    id: snapshot.goal?.workspaceId ?? 'legacy-primary',
    name: snapshot.goal?.workspaceName ?? 'Primary project',
    selected: true,
    activeOperations: snapshot.runtime.activeOperations,
    goals: snapshot.goal ? [snapshot.goal] : [],
    git: snapshot.git
  }];
}

export function snapshotGoals(snapshot: WatcherSnapshot): Goal[] {
  return snapshotWorkspaces(snapshot).flatMap((workspace) => workspace.goals);
}

export function workspaceName(snapshot: WatcherSnapshot, workspaceId?: string): string | undefined {
  if (!workspaceId) return undefined;
  return snapshotWorkspaces(snapshot).find((workspace) => workspace.id === workspaceId)?.name;
}

export function formatTime(value: string, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(value));
}

export function formatRelativeTime(value: string, now = Date.now(), locale = 'en-US'): string {
  const deltaMs = new Date(value).getTime() - now;
  const absoluteMs = Math.abs(deltaMs);
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  if (absoluteMs < 60_000) return formatter.format(Math.round(deltaMs / 1_000), 'second');
  if (absoluteMs < 3_600_000) return formatter.format(Math.round(deltaMs / 60_000), 'minute');
  if (absoluteMs < 86_400_000) return formatter.format(Math.round(deltaMs / 3_600_000), 'hour');
  return formatter.format(Math.round(deltaMs / 86_400_000), 'day');
}

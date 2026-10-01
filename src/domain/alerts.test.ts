import { describe, expect, it } from 'vitest';
import { demoSnapshot } from '../data/demo';
import { deriveAlerts } from './alerts';

const now = Date.parse('2026-09-27T12:00:00.000Z');
const sync = new Date(now).toISOString();
const base = { state: 'connected' as const, mode: 'remote' as const, lastSyncAt: sync, now, inactivityMinutes: 10 as const };

function snapshotWithGoal(lastCheckpointAt: string) {
  const goal = {
    ...demoSnapshot.workspaces[0]!.goals[0]!, status: 'waiting' as const,
    createdAt: '2026-09-27T11:00:00.000Z', lastCheckpointAt,
    completionReady: false, activeTaskCount: 0,
  };
  return {
    ...demoSnapshot,
    activity: [],
    workspaces: [{ ...demoSnapshot.workspaces[0]!, activeOperations: 0, goals: [goal] }],
  };
}

describe('stalled goal alerts', () => {
  it('alerts once for an open idle goal after the configured threshold', () => {
    const snapshot = snapshotWithGoal('2026-09-27T11:49:00.000Z');
    expect(deriveAlerts({ ...base, snapshot }).map((alert) => alert.kind)).toEqual(['goal_stalled']);
    expect(deriveAlerts({ ...base, snapshot })[0]?.id).toBe(deriveAlerts({ ...base, snapshot, now: now + 60_000 })[0]?.id);
    expect(deriveAlerts({ ...base, snapshot, inactivityMinutes: 5 })[0]?.kind).toBe('goal_stalled');
  });

  it('stops stale alerts as soon as the goal closes or progresses', () => {
    const snapshot = snapshotWithGoal('2026-09-27T11:49:00.000Z');
    expect(deriveAlerts({ ...base, snapshot: { ...snapshot, workspaces: [{ ...snapshot.workspaces[0]!, goals: [] }] } })).toEqual([]);
    expect(deriveAlerts({ ...base, snapshot: snapshotWithGoal('2026-09-27T11:55:00.000Z') })).toEqual([]);
    expect(deriveAlerts({ ...base, snapshot: { ...snapshot, workspaces: [{ ...snapshot.workspaces[0]!, activeOperations: 1 }] } })).toEqual([]);
  });

  it('shows finalization instead of stalled work and suppresses alerts from stale snapshots', () => {
    const snapshot = snapshotWithGoal('2026-09-27T11:49:00.000Z');
    const ready = { ...snapshot, workspaces: [{ ...snapshot.workspaces[0]!, goals: [{ ...snapshot.workspaces[0]!.goals[0]!, completionReady: true }] }] };
    expect(deriveAlerts({ ...base, snapshot: ready }).map((alert) => alert.kind)).toEqual(['goal_ready']);
    const legacyReady = { ...snapshot, workspaces: [{ ...snapshot.workspaces[0]!, goals: [{ ...snapshot.workspaces[0]!.goals[0]!, completionReady: undefined, milestones: [{ id: 'done', title: 'Done', status: 'completed' as const }] }] }] };
    expect(deriveAlerts({ ...base, snapshot: legacyReady }).map((alert) => alert.kind)).toEqual(['goal_ready']);
    expect(deriveAlerts({ ...base, snapshot, lastSyncAt: '2026-09-27T11:50:00.000Z' })).toEqual([]);
  });
});

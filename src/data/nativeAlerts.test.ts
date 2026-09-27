import { describe, expect, it } from 'vitest';
import { demoSnapshot } from './demo';
import { buildNativeAlertTargets } from './nativeAlerts';

describe('Android alert targets', () => {
  it('schedules only open goals without observable operations and removes completed goals', () => {
    const goal = {
      ...demoSnapshot.workspaces[0]!.goals[0]!,
      status: 'waiting' as const, completionReady: false,
      createdAt: '2026-09-27T00:00:00.000Z', lastCheckpointAt: '2026-09-27T00:05:00.000Z',
    };
    const snapshot = {
      ...demoSnapshot, activity: [],
      workspaces: [{ ...demoSnapshot.workspaces[0]!, activeOperations: 0, goals: [goal] }],
    };
    expect(buildNativeAlertTargets(snapshot)).toMatchObject([{ goalId: goal.id, observedAt: goal.lastCheckpointAt }]);
    expect(buildNativeAlertTargets({ ...snapshot, workspaces: [{ ...snapshot.workspaces[0]!, goals: [{ ...goal, completionReady: true }] }] })).toEqual([]);
    expect(buildNativeAlertTargets({ ...snapshot, workspaces: [{ ...snapshot.workspaces[0]!, goals: [] }] })).toEqual([]);
  });
});

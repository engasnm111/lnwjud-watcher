import { describe, expect, it } from 'vitest';
import { demoSnapshot } from './demo';
import { buildWidgetState } from './widget';

describe('buildWidgetState', () => {
  it('keeps only launcher-safe monitoring state and highlights current work', () => {
    const state = buildWidgetState(demoSnapshot, 'connected', '2026-09-26T05:50:00+07:00');

    expect(state.instanceName).toBe(demoSnapshot.instance.name);
    expect(state.activeGoalCount).toBe(demoSnapshot.workspaces.flatMap((workspace) => workspace.goals).length);
    expect(state.currentGoal?.title).toBe(demoSnapshot.goal?.key);
    expect(state.lastActivity?.summary).toBe(demoSnapshot.activity[0]?.summary);
    expect(state.agents.length).toBeLessThanOrEqual(3);
    expect(JSON.stringify(state)).not.toContain('token');
  });

  it('produces useful offline state before the first snapshot arrives', () => {
    const state = buildWidgetState(null, 'offline', null);

    expect(state.runtimeStatus).toBe('offline');
    expect(state.activeGoalCount).toBe(0);
    expect(state.activeAgentCount).toBe(0);
    expect(state.currentGoal).toBeNull();
    expect(state.lastActivity).toBeNull();
  });
});

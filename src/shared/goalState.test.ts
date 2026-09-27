import { describe, expect, it } from 'vitest';
import type { Goal } from '../domain/models';
import { goalNeedsFinalization } from './goalState';

const goal: Goal = {
  id: 'goal-1', key: 'release', status: 'waiting', currentTask: '', blockers: [],
  milestones: [{ id: 'step-1', title: 'Verify', status: 'completed' }],
};

describe('goal finalization state', () => {
  it('flags active goals whose milestones are all completed', () => {
    expect(goalNeedsFinalization(goal)).toBe(true);
    expect(goalNeedsFinalization({ ...goal, status: 'running' })).toBe(true);
  });

  it('never treats a milestone percentage as proof of a terminal goal', () => {
    expect(goalNeedsFinalization({ ...goal, status: 'done' })).toBe(false);
    expect(goalNeedsFinalization({ ...goal, blockers: ['Review required'] })).toBe(false);
    expect(goalNeedsFinalization({ ...goal, milestones: [] })).toBe(false);
    expect(goalNeedsFinalization({ ...goal, milestones: [{ id: 'step-1', title: 'Verify', status: 'pending' }] })).toBe(false);
  });

  it('uses the runtime completion readiness when acceptance criteria are still pending', () => {
    expect(goalNeedsFinalization({ ...goal, lifecycle: 'active', completionReady: false })).toBe(false);
    expect(goalNeedsFinalization({ ...goal, lifecycle: 'active', completionReady: true })).toBe(true);
  });
});

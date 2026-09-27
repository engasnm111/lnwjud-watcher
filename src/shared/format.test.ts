import { describe, expect, it } from 'vitest';
import { goalProgress } from './format';

describe('goal progress', () => {
  it('includes runtime acceptance checks when available', () => {
    expect(goalProgress({
      id: 'goal', key: 'release', status: 'waiting', currentTask: '', blockers: [],
      milestones: [{ id: 'build', title: 'Build', status: 'completed' }],
      acceptanceCriteria: [{ id: 'ci', title: 'CI passed', status: 'pending' }],
    })).toBe(50);
  });
});

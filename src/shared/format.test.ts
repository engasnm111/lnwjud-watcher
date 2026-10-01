import { describe, expect, it } from 'vitest';
import { goalProgress } from './format';

describe('goal progress', () => {
  it('calculates progress from milestones without double-counting acceptance criteria', () => {
    expect(goalProgress({
      id: 'goal', key: 'release', status: 'waiting', currentTask: '', blockers: [],
      milestones: [
        { id: 'build', title: 'Build', status: 'completed' },
        { id: 'publish', title: 'Publish', status: 'pending' },
      ],
      acceptanceCriteria: [
        { id: 'ci', title: 'CI passed', status: 'pending' },
        { id: 'release', title: 'Release published', status: 'pending' },
      ],
    })).toBe(50);
  });
});

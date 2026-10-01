import { describe, expect, it } from 'vitest';
import { filterActivity } from './activityFilters';

describe('activity filters', () => {
  it('combines project, status, kind, and search without modifying the source feed', () => {
    const events = [
      { id: 'a', timestamp: '2026-09-27T00:00:00.000Z', kind: 'goal.checkpoint', status: 'done' as const, actor: 'LNWJUD', summary: 'CI verified', workspaceId: 'p1' },
      { id: 'b', timestamp: '2026-09-27T00:00:00.000Z', kind: 'tool.call', status: 'error' as const, actor: 'Codex', summary: 'Build failed', workspaceId: 'p2' },
    ];
    const filtered = filterActivity(events, { workspaceId: 'p1', status: 'done', kind: 'goal.checkpoint', query: 'verified' });
    expect(filtered.map((item) => item.id)).toEqual(['a']);
    expect(events).toHaveLength(2);
    expect(filterActivity(events, { workspaceId: '', status: 'error', kind: '', query: 'build' }).map((item) => item.id)).toEqual(['b']);
  });
});

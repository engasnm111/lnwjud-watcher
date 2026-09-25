import { describe, expect, it } from 'vitest';
import { demoSnapshot } from '../data/demo';
import { FALLBACK_REFRESH_MS, mergeActivityEvent, shouldUseFallbackPolling } from './WatcherContext';

describe('realtime freshness policy', () => {
  it('polls every five seconds only when a remote realtime connection is not healthy', () => {
    expect(FALLBACK_REFRESH_MS).toBe(5_000);
    expect(shouldUseFallbackPolling('remote', 'reconnecting')).toBe(true);
    expect(shouldUseFallbackPolling('remote', 'error')).toBe(true);
    expect(shouldUseFallbackPolling('remote', 'connected')).toBe(false);
    expect(shouldUseFallbackPolling('demo', 'offline')).toBe(false);
  });

  it('deduplicates repeated realtime events by event id', () => {
    const event = {
      id: 'same-event',
      timestamp: new Date().toISOString(),
      kind: 'work',
      status: 'running' as const,
      actor: '@lnwjud',
      summary: 'Running work'
    };

    const once = mergeActivityEvent(demoSnapshot, event);
    const twice = mergeActivityEvent(once, event);

    expect(once.activity[0].id).toBe('same-event');
    expect(twice.activity.filter((item) => item.id === 'same-event')).toHaveLength(1);
  });
});

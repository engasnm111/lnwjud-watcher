import { act, cleanup, render, waitFor } from '@testing-library/react';
import { createElement } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { demoSnapshot } from '../data/demo';
import { FALLBACK_REFRESH_MS, mergeActivityEvent, shouldUseFallbackPolling, useWatcher, WatcherProvider } from './WatcherContext';

class FakeWebSocket {
  static instances: FakeWebSocket[] = [];
  onopen: (() => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: (() => void) | null = null;
  onclose: (() => void) | null = null;

  constructor(readonly url: string) {
    FakeWebSocket.instances.push(this);
  }

  send(): void {}
  close(): void {}

  emitMessage(value: unknown): void {
    this.onmessage?.({ data: JSON.stringify(value) } as MessageEvent);
  }
}

function SnapshotProbe() {
  const { snapshot } = useWatcher();
  return createElement('span', { 'data-testid': 'current-task' }, snapshot?.goal?.currentTask ?? 'none');
}

function deferred<T>(): { promise: Promise<T>; resolve: (value: T) => void } {
  let resolve!: (value: T) => void;
  return { promise: new Promise<T>((done) => { resolve = done; }), resolve };
}

afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
  FakeWebSocket.instances = [];
  vi.unstubAllGlobals();
});

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

  it('resyncs the authoritative snapshot after a realtime event', async () => {
    localStorage.setItem('lnwjud-watcher.profile.v1', JSON.stringify({
      mode: 'remote',
      name: 'Test runtime',
      provider: 'local',
      endpoint: 'http://127.0.0.1:17890'
    }));
    sessionStorage.setItem('lnwjud-watcher.session-token', 'test-token');
    vi.stubGlobal('WebSocket', FakeWebSocket);

    const updated = {
      ...demoSnapshot,
      goal: demoSnapshot.goal === null ? null : { ...demoSnapshot.goal, currentTask: 'Realtime-resynced task' },
      serverTime: new Date().toISOString()
    };
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => demoSnapshot })
      .mockResolvedValue({ ok: true, status: 200, json: async () => updated });
    vi.stubGlobal('fetch', fetchMock);

    const view = render(createElement(WatcherProvider, null, createElement(SnapshotProbe)));
    await waitFor(() => expect(view.getByTestId('current-task')).toHaveTextContent(demoSnapshot.goal?.currentTask ?? 'none'));
    expect(FakeWebSocket.instances).toHaveLength(1);
    const callsBeforeEvent = fetchMock.mock.calls.length;

    act(() => {
      FakeWebSocket.instances[0]!.emitMessage({
        id: 'live-event',
        timestamp: new Date().toISOString(),
        kind: 'work',
        status: 'running',
        actor: '@lnwjud',
        summary: 'Runtime changed'
      });
    });

    await waitFor(() => expect(fetchMock.mock.calls.length).toBeGreaterThan(callsBeforeEvent));
    await waitFor(() => expect(view.getByTestId('current-task')).toHaveTextContent('Realtime-resynced task'));
  });

  it('queues one trailing authoritative refresh when live activity arrives during an in-flight refresh', async () => {
    localStorage.setItem('lnwjud-watcher.profile.v1', JSON.stringify({
      mode: 'remote',
      name: 'Test runtime',
      provider: 'local',
      endpoint: 'http://127.0.0.1:17890'
    }));
    sessionStorage.setItem('lnwjud-watcher.session-token', 'test-token');
    vi.stubGlobal('WebSocket', FakeWebSocket);

    const stale = {
      ...demoSnapshot,
      goal: demoSnapshot.goal === null ? null : { ...demoSnapshot.goal, currentTask: 'First resync' },
      serverTime: new Date().toISOString()
    };
    const latest = {
      ...demoSnapshot,
      goal: demoSnapshot.goal === null ? null : { ...demoSnapshot.goal, currentTask: 'Second resync' },
      serverTime: new Date().toISOString()
    };
    const firstResync = deferred<{ ok: boolean; status: number; json: () => Promise<typeof stale> }>();
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => demoSnapshot })
      .mockReturnValueOnce(firstResync.promise)
      .mockResolvedValue({ ok: true, status: 200, json: async () => latest });
    vi.stubGlobal('fetch', fetchMock);

    const view = render(createElement(WatcherProvider, null, createElement(SnapshotProbe)));
    await waitFor(() => expect(view.getByTestId('current-task')).toHaveTextContent(demoSnapshot.goal?.currentTask ?? 'none'));

    act(() => {
      FakeWebSocket.instances[0]!.emitMessage({
        id: 'event-1', timestamp: new Date().toISOString(), kind: 'work',
        status: 'running', actor: '@lnwjud', summary: 'First change'
      });
    });
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));

    act(() => {
      FakeWebSocket.instances[0]!.emitMessage({
        id: 'event-2', timestamp: new Date().toISOString(), kind: 'work',
        status: 'running', actor: '@lnwjud', summary: 'Second change'
      });
      firstResync.resolve({ ok: true, status: 200, json: async () => stale });
    });

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3));
    await waitFor(() => expect(view.getByTestId('current-task')).toHaveTextContent('Second resync'));
  });
});

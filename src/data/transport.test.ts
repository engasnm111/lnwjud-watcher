import { afterEach, describe, expect, it, vi } from 'vitest';
import { HttpWatcherTransport } from './transport';

class FakeWebSocket {
  static instances: FakeWebSocket[] = [];
  onopen: (() => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: (() => void) | null = null;
  onclose: (() => void) | null = null;
  readonly sent: string[] = [];

  constructor(readonly url: string) {
    FakeWebSocket.instances.push(this);
  }

  send(value: string): void {
    this.sent.push(value);
  }

  close(): void {}

  open(): void {
    this.onopen?.();
  }

  emit(value: unknown): void {
    this.onmessage?.({ data: JSON.stringify(value) } as MessageEvent);
  }
}

afterEach(() => {
  FakeWebSocket.instances = [];
  vi.unstubAllGlobals();
});

describe('HttpWatcherTransport realtime authentication', () => {
  it('reports connected only after the server confirms websocket authentication', () => {
    vi.stubGlobal('WebSocket', FakeWebSocket);
    const states: string[] = [];
    const events: unknown[] = [];
    const transport = new HttpWatcherTransport('http://127.0.0.1:17890', 'session-token');

    const unsubscribe = transport.subscribe(
      (event) => events.push(event),
      (state) => states.push(state)
    );

    expect(states).toEqual(['connecting']);
    expect(FakeWebSocket.instances).toHaveLength(1);
    const socket = FakeWebSocket.instances[0]!;
    socket.open();

    expect(socket.sent).toEqual([JSON.stringify({ type: 'auth', token: 'session-token' })]);
    expect(states).not.toContain('connected');

    socket.emit({ type: 'ready', protocolVersion: 2 });
    expect(states.at(-1)).toBe('error');

    socket.emit({ type: 'ready', protocolVersion: 1 });
    expect(states.at(-1)).toBe('connected');

    socket.emit({
      id: 'event-1',
      timestamp: new Date().toISOString(),
      kind: 'work',
      status: 'running',
      actor: '@lnwjud',
      summary: 'Work changed'
    });
    expect(events).toHaveLength(1);

    unsubscribe();
  });
});

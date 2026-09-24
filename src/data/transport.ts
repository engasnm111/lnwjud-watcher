import type { ActivityEvent, ConnectionState, WatcherSnapshot } from '../domain/models';
import { parseActivityEvent, parseSnapshot } from './protocol';

export interface WatcherTransport {
  getSnapshot(): Promise<WatcherSnapshot>;
  subscribe(onEvent: (event: ActivityEvent) => void, onState: (state: ConnectionState) => void): () => void;
}

export function normalizeEndpoint(endpoint: string): string {
  const value = endpoint.trim().replace(/\/+$/, '');
  const url = new URL(value);
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Watcher endpoint must use HTTP or HTTPS');
  if (url.protocol !== 'https:' && !local) throw new Error('Remote watcher endpoints must use HTTPS');
  return url.toString().replace(/\/$/, '');
}

export function toWebSocketUrl(endpoint: string): string {
  const url = new URL(normalizeEndpoint(endpoint));
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  url.pathname = `${url.pathname.replace(/\/$/, '')}/api/v1/events`;
  return url.toString();
}

export class HttpWatcherTransport implements WatcherTransport {
  constructor(private readonly endpoint: string, private readonly token?: string) {}

  private headers(): HeadersInit {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  async getSnapshot(): Promise<WatcherSnapshot> {
    const response = await fetch(`${normalizeEndpoint(this.endpoint)}/api/v1/snapshot`, { headers: this.headers() });
    if (!response.ok) throw new Error(`Watcher API returned HTTP ${response.status}`);
    return parseSnapshot(await response.json());
  }

  subscribe(onEvent: (event: ActivityEvent) => void, onState: (state: ConnectionState) => void): () => void {
    let stopped = false;
    let socket: WebSocket | undefined;
    let timer: number | undefined;
    let attempts = 0;

    const connect = () => {
      if (stopped) return;
      onState(attempts === 0 ? 'connecting' : 'reconnecting');
      socket = new WebSocket(toWebSocketUrl(this.endpoint));
      socket.onopen = () => {
        attempts = 0;
        if (this.token) socket?.send(JSON.stringify({ type: 'auth', token: this.token }));
        onState('connected');
      };
      socket.onmessage = (message) => {
        try { onEvent(parseActivityEvent(JSON.parse(String(message.data)))); } catch { /* reject malformed remote events */ }
      };
      socket.onerror = () => onState('error');
      socket.onclose = () => {
        if (stopped) return;
        attempts += 1;
        onState('reconnecting');
        timer = window.setTimeout(connect, Math.min(30_000, 1_000 * 2 ** Math.min(attempts, 5)));
      };
    };

    connect();
    return () => {
      stopped = true;
      if (timer !== undefined) window.clearTimeout(timer);
      socket?.close();
    };
  }
}
